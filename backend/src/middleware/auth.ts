import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '@hivepulse/shared';
import { extractBearerToken, verifyAccessToken } from '../lib/jwt';
import { User } from '../modules/auth/user.model';
import { AppError } from '../utils/appError';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Validates the Bearer token, attaches verified claims and the current user.
 * Password hash is never loaded on this path.
 */
export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractBearerToken(req.headers.authorization);
  const payload = verifyAccessToken(token);

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new AppError(401, 'USER_NOT_FOUND', 'Account no longer exists.');
  }

  if (user.role !== payload.role) {
    throw new AppError(401, 'INVALID_TOKEN', 'Session expired or invalid. Please sign in again.');
  }

  req.auth = payload;
  req.user = user;
  next();
});

/**
 * Restricts access to one or more roles. Must run after {@link authenticate}.
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !req.auth) {
      throw new AppError(401, 'UNAUTHORIZED', 'Authentication required.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(403, 'FORBIDDEN', 'You do not have permission for this action.');
    }

    next();
  };
}
