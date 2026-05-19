import { useCallback, useEffect, useState } from 'react';
import type { Lead, LeadQueryParams, PaginationMeta } from '@hivepulse/shared';
import { api, ApiClientError } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { AppShell } from '@/components/layout/AppShell';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadForm, type LeadFormValues } from '@/components/leads/LeadForm';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { TableSkeleton } from '@/components/ui/Skeleton';

type ModalMode = 'create' | 'edit' | 'delete' | null;

export function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [filters, setFilters] = useState<LeadQueryParams & { searchInput: string }>({
    page: 1,
    sort: 'latest',
    searchInput: '',
  });
  const debouncedSearch = useDebounce(filters.searchInput, 400);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.leads.list({
        page: filters.page,
        status: filters.status,
        source: filters.source,
        search: debouncedSearch || undefined,
        sort: filters.sort,
      });
      if (res.success) {
        setLeads(res.data);
        setMeta(res.meta);
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to load leads.');
    } finally {
      setIsLoading(false);
    }
  }, [filters.page, filters.status, filters.source, filters.sort, debouncedSearch]);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setFilters((f) => ({ ...f, page: 1 }));
  }, [debouncedSearch, filters.status, filters.source, filters.sort]);

  const handleFilterChange = (patch: Partial<LeadQueryParams & { searchInput: string }>) => {
    setFilters((f) => ({ ...f, ...patch, page: patch.page ?? (patch.searchInput !== undefined ? 1 : f.page) }));
  };

  const openCreate = () => {
    setSelectedLead(null);
    setModalMode('create');
    setActionError('');
  };

  const openEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setModalMode('edit');
    setActionError('');
  };

  const openDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setModalMode('delete');
    setActionError('');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedLead(null);
    setActionError('');
  };

  const handleCreate = async (values: LeadFormValues) => {
    try {
      await api.leads.create(values);
      closeModal();
      await fetchLeads();
    } catch (err) {
      setActionError(err instanceof ApiClientError ? err.message : 'Could not create lead.');
      throw err;
    }
  };

  const handleUpdate = async (values: LeadFormValues) => {
    if (!selectedLead) return;
    try {
      await api.leads.update(selectedLead.id, values);
      closeModal();
      await fetchLeads();
    } catch (err) {
      setActionError(err instanceof ApiClientError ? err.message : 'Could not update lead.');
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!selectedLead) return;
    try {
      await api.leads.delete(selectedLead.id);
      closeModal();
      await fetchLeads();
    } catch (err) {
      setActionError(err instanceof ApiClientError ? err.message : 'Could not delete lead.');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await api.leads.exportCsv({
        status: filters.status,
        source: filters.source,
        search: debouncedSearch || undefined,
        sort: filters.sort,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hivepulse-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Leads</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track pipeline activity across your sales team
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void handleExport()} isLoading={isExporting}>
            Export CSV
          </Button>
          <Button onClick={openCreate}>Add lead</Button>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <LeadFilters filters={filters} onChange={handleFilterChange} />
      </div>

      {error && (
        <div className="mb-4">
          <Alert message={error} />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        {isLoading ? (
          <TableSkeleton rows={8} />
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads match your filters"
            description="Try adjusting search or filters, or add a new lead to get started."
            action={<Button onClick={openCreate}>Add your first lead</Button>}
          />
        ) : (
          <LeadTable
            leads={leads}
            isAdmin={!!isAdmin}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>
            Page {meta.page} of {meta.totalPages} · {meta.total} leads
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!meta.hasPrevPage}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!meta.hasNextPage}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={modalMode === 'create'}
        title="Add lead"
        onClose={closeModal}
        footer={null}
      >
        {actionError && <div className="mb-4"><Alert message={actionError} /></div>}
        <LeadForm submitLabel="Create lead" onSubmit={handleCreate} onCancel={closeModal} />
      </Modal>

      <Modal
        open={modalMode === 'edit'}
        title="Edit lead"
        onClose={closeModal}
      >
        {actionError && <div className="mb-4"><Alert message={actionError} /></div>}
        {selectedLead && (
          <LeadForm
            initial={selectedLead}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={closeModal}
          />
        )}
      </Modal>

      <Modal
        open={modalMode === 'delete'}
        title="Delete lead"
        onClose={closeModal}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void handleDelete()}>
              Delete
            </Button>
          </>
        }
      >
        {actionError && <Alert message={actionError} />}
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Remove <strong>{selectedLead?.name}</strong> from the pipeline? This cannot be undone.
        </p>
      </Modal>
    </AppShell>
  );
}
