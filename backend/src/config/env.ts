import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function requirePort(key: string): number {
  const port = Number.parseInt(requireEnv(key), 10);
  if (!Number.isFinite(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid port in environment variable: ${key}`);
  }
  return port;
}

function optionalEnv(key: string, fallback: string): string {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : fallback;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: requirePort('PORT'),
  mongoUri: requireEnv('MONGO_URI'),
  corsOrigin: requireEnv('CORS_ORIGIN'),
  apiPrefix: requireEnv('API_PREFIX'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
  isProduction: process.env.NODE_ENV === 'production',
} as const;
