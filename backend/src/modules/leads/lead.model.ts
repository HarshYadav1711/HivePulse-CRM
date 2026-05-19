import mongoose from 'mongoose';
import { LEAD_SOURCES, LEAD_STATUSES, type LeadSource, type LeadStatus } from '@hivepulse/shared';

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
}

export type ILeadDocument = mongoose.Document<mongoose.Types.ObjectId> & ILead;

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: {
        values: LEAD_STATUSES,
        message: 'Invalid lead status.',
      },
      default: 'New',
    },
    source: {
      type: String,
      enum: {
        values: LEAD_SOURCES,
        message: 'Invalid lead source.',
      },
      required: [true, 'Source is required.'],
    },
  },
  { timestamps: true },
);

leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ name: 1 });
leadSchema.index({ email: 1 });

export const Lead =
  (mongoose.models.Lead as mongoose.Model<ILeadDocument> | undefined) ??
  mongoose.model<ILeadDocument>('Lead', leadSchema);
