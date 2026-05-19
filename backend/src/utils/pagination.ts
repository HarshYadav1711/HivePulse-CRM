import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from '@hivepulse/shared';
import type { PaginationMeta } from '@hivepulse/shared';

export function parsePaginationQuery(
  pageRaw?: string,
  limitRaw?: string,
): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(pageRaw ?? '1', 10) || 1);
  const limit = Math.min(
    MAX_PAGE_LIMIT,
    Math.max(1, parseInt(limitRaw ?? String(DEFAULT_PAGE_LIMIT), 10) || DEFAULT_PAGE_LIMIT),
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
