import type { LeadPublic } from '@hivepulse/shared';
import type { ILeadDocument } from './lead.model';

type LeadLike = Pick<ILeadDocument, 'name' | 'email' | 'status' | 'source' | 'createdAt' | 'updatedAt'> & {
  _id: { toString(): string };
};

export function toLeadPublic(doc: LeadLike): LeadPublic {
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
