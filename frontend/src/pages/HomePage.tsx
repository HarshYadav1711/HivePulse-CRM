import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type HealthPayload = { status: string; service: string };

export function HomePage() {
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<HealthPayload>('/health')
      .then((result) => {
        if (result.success) {
          setHealth(result.data);
        } else {
          setError(result.error.message);
        }
      })
      .catch(() => setError('Unable to reach the API.'));
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Project foundation is ready. Add feature modules under{' '}
        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">src/modules</code> on the
        backend and <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">src/pages</code>{' '}
        on the frontend.
      </p>
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="font-medium text-slate-700 dark:text-slate-300">API health</p>
        {health && (
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {health.service} — {health.status}
          </p>
        )}
        {error && <p className="mt-1 text-red-600 dark:text-red-400">{error}</p>}
        {!health && !error && (
          <p className="mt-1 text-slate-500 dark:text-slate-500">Checking…</p>
        )}
      </div>
    </section>
  );
}
