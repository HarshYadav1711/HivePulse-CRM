import type { LeadStatus } from '@hivepulse/shared';

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  Contacted: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Qualified: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  Lost: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

interface BadgeProps {
  status: LeadStatus;
}

export function StatusBadge({ status }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
