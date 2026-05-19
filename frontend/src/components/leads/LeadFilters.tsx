import { LEAD_SOURCES, LEAD_STATUSES } from '@hivepulse/shared';
import type { LeadQueryParams, LeadSource, LeadStatus, SortOrder } from '@hivepulse/shared';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';

interface LeadFiltersProps {
  filters: LeadQueryParams & { searchInput: string };
  onChange: (patch: Partial<LeadQueryParams & { searchInput: string }>) => void;
}

export function LeadFilters({ filters, onChange }: LeadFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Input
        label="Search"
        name="search"
        placeholder="Name or email…"
        value={filters.searchInput}
        onChange={(e) => onChange({ searchInput: e.target.value })}
      />
      <Select
        label="Status"
        name="status"
        value={filters.status ?? ''}
        onChange={(e) =>
          onChange({ status: (e.target.value || undefined) as LeadStatus | undefined })
        }
        options={[
          { value: '', label: 'All statuses' },
          ...LEAD_STATUSES.map((s) => ({ value: s, label: s })),
        ]}
      />
      <Select
        label="Source"
        name="source"
        value={filters.source ?? ''}
        onChange={(e) =>
          onChange({ source: (e.target.value || undefined) as LeadSource | undefined })
        }
        options={[
          { value: '', label: 'All sources' },
          ...LEAD_SOURCES.map((s) => ({ value: s, label: s })),
        ]}
      />
      <Select
        label="Sort"
        name="sort"
        value={filters.sort ?? 'latest'}
        onChange={(e) => onChange({ sort: e.target.value as SortOrder })}
        options={[
          { value: 'latest', label: 'Newest first' },
          { value: 'oldest', label: 'Oldest first' },
        ]}
      />
    </div>
  );
}
