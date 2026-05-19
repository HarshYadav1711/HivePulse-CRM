import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRole } from '@hivepulse/shared';
import { env } from '../config/env';
import { AppError } from '../utils/appError';
import { User, type IUserDocument } from '../modules/auth/user.model';

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      auth?: AuthPayload;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication required.');
  }

  const token = header.slice(7);
  let payload: AuthPayload;

  try {
    payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
  } catch {
    throw new AppError(401, 'INVALID_TOKEN', 'Session expired or invalid. Please sign in again.');
  }

  const user = await User.findById(payload.userId).select('+password');
  if (!user) {
    throw new AppError(401, 'USER_NOT_FOUND', 'Account no longer exists.');
  }

  req.user = user;
  req.auth = payload;
  next();
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Authentication required.');
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError(403, 'FORBIDDEN', 'You do not have permission for this action.');
    }
    next();
  };
}
