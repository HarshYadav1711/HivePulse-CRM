import type { ApiResponse } from '@hivepulse/shared';
import { clientEnv } from './env';

function joinUrl(base: string, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${trimmedBase}${normalizedPath}`;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(joinUrl(clientEnv.apiBaseUrl, path), {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  return response.json() as Promise<ApiResponse<T>>;
}
