import type {
  ApiErrorResponse,
  ApiPaginatedResult,
  ApiSuccessResponse,
  AuthTokens,
  Lead,
  LeadQueryParams,
  PaginationMeta,
  UserPublic,
} from '@hivepulse/shared';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

function getToken(): string | null {
  return localStorage.getItem('hivepulse_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    const err = body as ApiErrorResponse | null;
    throw new ApiClientError(
      response.status,
      err?.error?.code ?? 'REQUEST_FAILED',
      err?.error?.message ?? 'Request failed. Please try again.',
      err?.error?.details,
    );
  }

  return body as T;
}

export const api = {
  auth: {
    register: (payload: { name: string; email: string; password: string; role?: string }) =>
      request<ApiSuccessResponse<AuthTokens>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    login: (payload: { email: string; password: string }) =>
      request<ApiSuccessResponse<AuthTokens>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    me: () => request<ApiSuccessResponse<UserPublic>>('/auth/me'),
  },

  leads: {
    list: (params: LeadQueryParams) => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.status) searchParams.set('status', params.status);
      if (params.source) searchParams.set('source', params.source);
      if (params.search) searchParams.set('search', params.search);
      if (params.sort) searchParams.set('sort', params.sort);
      searchParams.set('limit', '10');

      const qs = searchParams.toString();
      return request<ApiPaginatedResult<Lead>>(`/leads?${qs}`);
    },

    create: (payload: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) =>
      request<ApiSuccessResponse<Lead>>('/leads', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    update: (id: string, payload: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>) =>
      request<ApiSuccessResponse<Lead>>(`/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),

    delete: (id: string) =>
      request<ApiSuccessResponse<{ id: string }>>(`/leads/${id}`, { method: 'DELETE' }),

    exportCsv: async (params: LeadQueryParams): Promise<Blob> => {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.set('status', params.status);
      if (params.source) searchParams.set('source', params.source);
      if (params.search) searchParams.set('search', params.search);
      if (params.sort) searchParams.set('sort', params.sort);

      const token = getToken();
      const response = await fetch(`${API_BASE}/leads/export?${searchParams}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new ApiClientError(response.status, 'EXPORT_FAILED', 'Could not export leads.');
      }

      return response.blob();
    },
  },
};

export type { PaginationMeta };
