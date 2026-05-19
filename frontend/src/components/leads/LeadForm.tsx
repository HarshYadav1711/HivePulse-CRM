import { useState, type FormEvent } from 'react';
import { LEAD_SOURCES, LEAD_STATUSES } from '@hivepulse/shared';
import type { Lead, LeadSource, LeadStatus } from '@hivepulse/shared';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { isValidEmail } from '@hivepulse/shared';

export interface LeadFormValues {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

interface LeadFormProps {
  initial?: Partial<Lead>;
  submitLabel: string;
  onSubmit: (values: LeadFormValues) => Promise<void>;
  onCancel: () => void;
}

export function LeadForm({ initial, submitLabel, onSubmit, onCancel }: LeadFormProps) {
  const [values, setValues] = useState<LeadFormValues>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    status: initial?.status ?? 'New',
    source: initial?.source ?? 'Website',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: Partial<Record<keyof LeadFormValues, string>> = {};
    if (values.name.trim().length < 2) next.name = 'Name must be at least 2 characters.';
    if (!isValidEmail(values.email)) next.email = 'Enter a valid email address.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...values,
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Full name"
        name="name"
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        error={errors.name}
        placeholder="e.g. Maya Chen"
        autoComplete="name"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        error={errors.email}
        placeholder="maya@company.com"
        autoComplete="email"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Status"
          name="status"
          value={values.status}
          onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as LeadStatus }))}
          options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <Select
          label="Source"
          name="source"
          value={values.source}
          onChange={(e) => setValues((v) => ({ ...v, source: e.target.value as LeadSource }))}
          options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
