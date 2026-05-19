import type { FilterQuery } from 'mongoose';
import type { Lead as LeadDto } from '@hivepulse/shared';
import { DEFAULT_PAGE_LIMIT } from '@hivepulse/shared';
import type { PaginationMeta } from '@hivepulse/shared';
import { AppError } from '../../utils/appError';
import { buildPaginationMeta } from '../../utils/pagination';
import { Lead as LeadModel, type ILeadDocument } from './lead.model';
import { toLeadDto, type LeadRecord } from './lead.mapper';
import type { CreateLeadInput, LeadQueryInput, UpdateLeadInput } from './lead.schemas';

function buildFilter(query: LeadQueryInput): FilterQuery<ILeadDocument> {
  const filter: FilterQuery<ILeadDocument> = {};

  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;

  if (query.search) {
    const term = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(term, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  return filter;
}

export async function listLeads(
  query: LeadQueryInput,
): Promise<{ leads: LeadDto[]; meta: PaginationMeta }> {
  const page = query.page ?? 1;
  const limit = query.limit ?? DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;
  const filter = buildFilter(query);
  const sortDir = query.sort === 'oldest' ? 1 : -1;

  const [docs, total] = await Promise.all([
    LeadModel.find(filter).sort({ createdAt: sortDir }).skip(skip).limit(limit).lean(),
    LeadModel.countDocuments(filter),
  ]);

  return {
    leads: docs.map((doc) => toLeadDto(doc as unknown as LeadRecord)),
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function getLeadById(id: string): Promise<LeadDto> {
  const doc = await LeadModel.findById(id);
  if (!doc) {
    throw new AppError(404, 'LEAD_NOT_FOUND', 'Lead not found.');
  }
  return toLeadDto(doc);
}

export async function createLead(input: CreateLeadInput, userId: string): Promise<LeadDto> {
  const doc = await LeadModel.create({
    ...input,
    createdBy: userId,
  });
  return toLeadDto(doc);
}

export async function updateLead(id: string, input: UpdateLeadInput): Promise<LeadDto> {
  const doc = await LeadModel.findByIdAndUpdate(id, input, { new: true, runValidators: true });
  if (!doc) {
    throw new AppError(404, 'LEAD_NOT_FOUND', 'Lead not found.');
  }
  return toLeadDto(doc);
}

export async function deleteLead(id: string): Promise<void> {
  const result = await LeadModel.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'LEAD_NOT_FOUND', 'Lead not found.');
  }
}

export async function exportLeadsCsv(query: LeadQueryInput): Promise<string> {
  const filter = buildFilter(query);
  const sortDir = query.sort === 'oldest' ? 1 : -1;
  const docs = await LeadModel.find(filter).sort({ createdAt: sortDir }).lean();

  const header = 'Name,Email,Status,Source,Created At';
  const rows = docs.map((doc) => {
    const lead = toLeadDto(doc as unknown as LeadRecord);
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    return [
      escape(lead.name),
      escape(lead.email),
      escape(lead.status),
      escape(lead.source),
      escape(new Date(lead.createdAt).toLocaleString('en-US')),
    ].join(',');
  });

  return [header, ...rows].join('\n');
}
