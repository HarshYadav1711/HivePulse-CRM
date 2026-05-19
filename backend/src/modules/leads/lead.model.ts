import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { LeadSource, LeadStatus } from '@hivepulse/shared';
import { LEAD_SOURCES, LEAD_STATUSES } from '@hivepulse/shared';

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadDocument extends ILead, Document {}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    status: { type: String, enum: LEAD_STATUSES, default: 'New' },
    source: { type: String, enum: LEAD_SOURCES, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text' });

export const Lead: Model<ILeadDocument> =
  mongoose.models.Lead ?? mongoose.model<ILeadDocument>('Lead', leadSchema);
