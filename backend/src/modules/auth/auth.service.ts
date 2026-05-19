import bcrypt from 'bcryptjs';
import { DEFAULT_USER_ROLE, type AuthSession } from '@hivepulse/shared';
import { env } from '../../config/env';
import { signAccessToken } from '../../lib/jwt';
import { AppError } from '../../utils/appError';
import type { LoginBody, RegisterBody, UserPublic } from './auth.dto';
import { toUserPublic } from './auth.mapper';
import { User, type IUserDocument } from './user.model';

const SALT_ROUNDS = 12;

function buildAuthSession(user: IUserDocument): AuthSession {
  return {
    user: toUserPublic(user),
    tokens: {
      accessToken: signAccessToken(user._id.toString(), user.role),
      tokenType: 'Bearer',
      expiresIn: env.jwtExpiresIn,
    },
  };
}

export async function registerUser(input: RegisterBody): Promise<AuthSession> {
  const email = input.email.toLowerCase();

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError(409, 'EMAIL_EXISTS', 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  let user: IUserDocument;
  try {
    user = await User.create({
      name: input.name,
      email,
      password: passwordHash,
      role: DEFAULT_USER_ROLE,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new AppError(409, 'EMAIL_EXISTS', 'An account with this email already exists.');
    }
    throw error;
  }

  return buildAuthSession(user);
}

export async function loginUser(input: LoginBody): Promise<AuthSession> {
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);
  if (!passwordMatches) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  return buildAuthSession(user);
}

export async function getCurrentUser(userId: string): Promise<UserPublic> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'Account not found.');
  }

  return toUserPublic(user);
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: number }).code === 11000
  );
}
