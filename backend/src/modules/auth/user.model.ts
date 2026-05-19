import mongoose from 'mongoose';
import { USER_ROLES, DEFAULT_USER_ROLE, type UserRole } from '@hivepulse/shared';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserDocument = mongoose.Document<mongoose.Types.ObjectId> & IUser;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: USER_ROLES,
        message: 'Invalid user role.',
      },
      default: DEFAULT_USER_ROLE,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        const { password: _password, ...safe } = ret;
        return safe;
      },
    },
  },
);

userSchema.index({ email: 1 }, { unique: true });

export const User =
  (mongoose.models.User as mongoose.Model<IUserDocument> | undefined) ??
  mongoose.model<IUserDocument>('User', userSchema);
