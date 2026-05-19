import type { Request, Response } from 'express';
import { sendPaginated, sendSuccess } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import * as leadService from './lead.service';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { leads, meta } = await leadService.listLeads(req.query as never);
  sendPaginated(res, leads, meta);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.getLeadById(String(req.params.id));
  sendSuccess(res, lead);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.createLead(req.body, req.user!._id.toString());
  sendSuccess(res, lead, 201, 'Lead created.');
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.updateLead(String(req.params.id), req.body);
  sendSuccess(res, lead, 200, 'Lead updated.');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await leadService.deleteLead(id);
  sendSuccess(res, { id }, 200, 'Lead deleted.');
});

export const exportCsv = asyncHandler(async (req: Request, res: Response) => {
  const csv = await leadService.exportLeadsCsv(req.query as never);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="hivepulse-leads.csv"');
  res.status(200).send(csv);
});
