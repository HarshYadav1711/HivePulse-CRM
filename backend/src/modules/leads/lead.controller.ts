import type { Request, Response } from 'express';
import { sendPaginated, sendSuccess } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import type { CreateLeadBody, LeadQuery, UpdateLeadBody } from './lead.dto';
import * as leadService from './lead.service';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as LeadQuery;
  const { leads, meta } = await leadService.listLeads(query);
  sendPaginated(res, leads, meta);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.getLeadById(String(req.params.id));
  sendSuccess(res, lead);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateLeadBody;
  const lead = await leadService.createLead(body);
  sendSuccess(res, lead, 201, 'Lead created.');
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as UpdateLeadBody;
  const lead = await leadService.updateLead(String(req.params.id), body);
  sendSuccess(res, lead, 200, 'Lead updated.');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await leadService.deleteLead(id);
  sendSuccess(res, { id }, 200, 'Lead deleted.');
});
