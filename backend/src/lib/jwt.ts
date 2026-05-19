import jwt, { type SignOptions } from 'jsonwebtoken';
import { isUserRole, type JwtPayload, type UserRole } from '@hivepulse/shared';
import { env } from '../config/env';
import { AppError } from '../utils/appError';

export function signAccessToken(userId: string, role: UserRole): string {
  const payload: JwtPayload = { sub: userId, role };
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  let decoded: unknown;

  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError(401, 'INVALID_TOKEN', 'Session expired or invalid. Please sign in again.');
  }

  if (!decoded || typeof decoded !== 'object') {
    throw new AppError(401, 'INVALID_TOKEN', 'Session expired or invalid. Please sign in again.');
  }

  const { sub, role } = decoded as Record<string, unknown>;

  if (typeof sub !== 'string' || !sub.trim()) {
    throw new AppError(401, 'INVALID_TOKEN', 'Session expired or invalid. Please sign in again.');
  }

  if (typeof role !== 'string' || !isUserRole(role)) {
    throw new AppError(401, 'INVALID_TOKEN', 'Session expired or invalid. Please sign in again.');
  }

  return { sub: sub.trim(), role };
}

export function extractBearerToken(authorizationHeader: string | undefined): string {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication required.');
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  if (!token) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication required.');
  }

  return token;
}
