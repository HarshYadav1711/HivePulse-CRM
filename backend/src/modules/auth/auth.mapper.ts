import { USER_ROLE_LABELS, type UserPublic } from '@hivepulse/shared';
import type { IUserDocument } from './user.model';

export function toUserPublic(user: IUserDocument): UserPublic {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    roleLabel: USER_ROLE_LABELS[user.role],
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
