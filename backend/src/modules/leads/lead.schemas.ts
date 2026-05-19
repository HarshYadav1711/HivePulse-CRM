import { z } from 'zod';
import { LEAD_SOURCES, LEAD_STATUSES } from '@hivepulse/shared';

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(120),
  email: z.string().trim().email('Enter a valid email address.'),
  status: z.enum(LEAD_STATUSES).optional().default('New'),
  source: z.enum(LEAD_SOURCES),
});

export const updateLeadSchema = createLeadSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required to update.' },
);

export const leadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  search: z.string().trim().optional(),
  sort: z.enum(['latest', 'oldest']).optional().default('latest'),
});

export const leadIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid lead id.'),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryInput = z.infer<typeof leadQuerySchema>;
