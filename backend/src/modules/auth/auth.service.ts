import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { AuthTokens, UserPublic } from '@hivepulse/shared';
import { env } from '../../config/env';
import { AppError } from '../../utils/appError';
import type { AuthPayload } from '../../middleware/auth';
import { User, type IUserDocument } from './user.model';
import type { LoginInput, RegisterInput } from './auth.schemas';

const SALT_ROUNDS = 12;

function toUserPublic(user: IUserDocument): UserPublic {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

function signToken(user: IUserDocument): string {
  const payload: AuthPayload = { userId: user._id.toString(), role: user.role };
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

export async function registerUser(input: RegisterInput): Promise<AuthTokens> {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new AppError(409, 'EMAIL_EXISTS', 'An account with this email already exists.');
  }

  const hashed = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: hashed,
    role: input.role ?? 'sales',
  });

  return { accessToken: signToken(user), user: toUserPublic(user) };
}

export async function loginUser(input: LoginInput): Promise<AuthTokens> {
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  return { accessToken: signToken(user), user: toUserPublic(user) };
}

export async function getCurrentUser(userId: string): Promise<UserPublic> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'Account not found.');
  }
  return toUserPublic(user);
}
