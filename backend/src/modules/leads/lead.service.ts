import { LEADS_PAGE_SIZE, type LeadPublic, type PaginationMeta } from '@hivepulse/shared';
import type { FilterQuery } from 'mongoose';
import { AppError } from '../../utils/appError';
import { buildPaginationMeta } from '../../utils/pagination';
import type { CreateLeadBody, LeadQuery, UpdateLeadBody } from './lead.dto';
import { toLeadPublic } from './lead.mapper';
import { Lead, type ILeadDocument } from './lead.model';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildLeadFilter(query: LeadQuery): FilterQuery<ILeadDocument> {
  const filter: FilterQuery<ILeadDocument> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.search) {
    const term = escapeRegex(query.search);
    const regex = new RegExp(term, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  return filter;
}

function buildSort(query: LeadQuery): Record<string, 1 | -1> {
  return { createdAt: query.sort === 'oldest' ? 1 : -1 };
}

export async function listLeads(
  query: LeadQuery,
): Promise<{ leads: LeadPublic[]; meta: PaginationMeta }> {
  const page = query.page ?? 1;
  const limit = LEADS_PAGE_SIZE;
  const skip = (page - 1) * limit;
  const filter = buildLeadFilter(query);
  const sort = buildSort(query);

  const [docs, total] = await Promise.all([
    Lead.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Lead.countDocuments(filter),
  ]);

  return {
    leads: docs.map((doc) => toLeadPublic(doc)),
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function getLeadById(id: string): Promise<LeadPublic> {
  const doc = await Lead.findById(id);
  if (!doc) {
    throw new AppError(404, 'LEAD_NOT_FOUND', 'Lead not found.');
  }

  return toLeadPublic(doc);
}

export async function createLead(input: CreateLeadBody): Promise<LeadPublic> {
  const doc = await Lead.create({
    name: input.name,
    email: input.email.toLowerCase(),
    status: input.status,
    source: input.source,
  });

  return toLeadPublic(doc);
}

export async function updateLead(id: string, input: UpdateLeadBody): Promise<LeadPublic> {
  const update: UpdateLeadBody = { ...input };
  if (update.email) {
    update.email = update.email.toLowerCase();
  }

  const doc = await Lead.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!doc) {
    throw new AppError(404, 'LEAD_NOT_FOUND', 'Lead not found.');
  }

  return toLeadPublic(doc);
}

export async function deleteLead(id: string): Promise<void> {
  const result = await Lead.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'LEAD_NOT_FOUND', 'Lead not found.');
  }
}
