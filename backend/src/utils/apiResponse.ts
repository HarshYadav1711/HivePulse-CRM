import type { Response } from 'express';
import type { ApiErrorResponse, ApiPaginatedResponse, ApiSuccessResponse, PaginationMeta } from '@hivepulse/shared';

export function sendSuccess<T>(res: Response, data: T, status = 200, message?: string): void {
  const body: ApiSuccessResponse<T> = { success: true, data };
  if (message) body.message = message;
  res.status(status).json(body);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  status = 200,
): void {
  const body: ApiPaginatedResponse<T> = { success: true, data, meta };
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
