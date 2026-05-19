type AlertVariant = 'error' | 'info' | 'success';

const styles: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300',
  info: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300',
};

interface AlertProps {
  variant?: AlertVariant;
  message: string;
}

export function Alert({ variant = 'error', message }: AlertProps) {
  if (!message) return null;
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]}`} role="alert">
      {message}
    </div>
  );
}
