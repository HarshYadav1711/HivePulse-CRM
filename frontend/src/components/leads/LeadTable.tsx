import type { Lead } from '@hivepulse/shared';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface LeadTableProps {
  leads: Lead[];
  isAdmin: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function LeadTable({ leads, isAdmin, onEdit, onDelete }: LeadTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <th className="px-4 py-3">Lead</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {leads.map((lead) => (
            <tr key={lead.id} className="text-sm hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900 dark:text-white">{lead.name}</p>
                <p className="text-slate-500 dark:text-slate-400">{lead.email}</p>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{lead.source}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(lead)}>
                    Edit
                  </Button>
                  {isAdmin && (
                    <Button variant="ghost" size="sm" onClick={() => onDelete(lead)}>
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
