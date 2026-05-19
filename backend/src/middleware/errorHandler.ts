import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/apiResponse';
import { AppError } from '../utils/appError';

export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, 404, 'NOT_FOUND', 'The requested resource was not found.');
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join('.') || 'body';
      if (!details[path]) details[path] = [];
      details[path].push(issue.message);
    }
    sendError(res, 400, 'VALIDATION_ERROR', 'Request validation failed.', details);
    return;
  }

  if (err instanceof Error && err.name === 'ValidationError') {
    sendError(res, 400, 'VALIDATION_ERROR', err.message);
    return;
  }

  if (err instanceof Error && err.name === 'CastError') {
    sendError(res, 400, 'INVALID_ID', 'Invalid resource identifier.');
    return;
  }

  console.error(err);
  sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong. Please try again.');
}
