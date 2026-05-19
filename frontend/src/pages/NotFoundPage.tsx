import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="space-y-3 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        The page you requested does not exist.
      </p>
      <Link
        to="/"
        className="inline-block text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
      >
        Back to home
      </Link>
    </section>
  );
}
