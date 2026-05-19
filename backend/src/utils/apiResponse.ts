import type { Response } from 'express';
import type { ApiErrorResponse, ApiSuccessResponse } from '@hivepulse/shared';

export function sendSuccess<T>(res: Response, data: T, status = 200, message?: string): void {
  const body: ApiSuccessResponse<T> = { success: true, data };
  if (message) body.message = message;
  res.status(status).json(body);
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: Record<string, string[]>,
): void {
  const body: ApiErrorResponse = {
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
  };
  res.status(status).json(body);
}
