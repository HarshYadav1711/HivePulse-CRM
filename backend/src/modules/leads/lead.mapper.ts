import type { Lead } from '@hivepulse/shared';
import type { LeadSource, LeadStatus } from '@hivepulse/shared';

export interface LeadRecord {
  _id: { toString(): string };
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
}

export function toLeadDto(doc: LeadRecord): Lead {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    status: doc.status,
    source: doc.source,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
