import type { LEAD_SOURCES, LEAD_STATUSES, USER_ROLES } from './constants';

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];
export type UserRole = (typeof USER_ROLES)[number];

export type SortOrder = 'latest' | 'oldest';

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
export type ApiPaginatedResult<T> = ApiPaginatedResponse<T> | ApiErrorResponse;

export interface AuthTokens {
  accessToken: string;
  user: UserPublic;
}

export interface LeadQueryParams {
  page?: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: SortOrder;
}
