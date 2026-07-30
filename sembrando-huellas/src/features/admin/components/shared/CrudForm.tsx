import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Save, X, Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/buttons/Button';
import CardBase from '@/components/cards/CardBase';
import { cn } from '@/lib/cn';

interface CrudFormProps {
  title: string;
  initialData?: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
  onPreview?: () => void;
  children: React.ReactNode;
  saving?: boolean;
}

export default function CrudForm({ title, onSave, onPreview, children, saving }: CrudFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSave = useCallback(() => {
    onSave({});
  }, [onSave]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onPreview && (
            <Button variant="outline" size="sm" onClick={onPreview}>
              <Eye size={16} /> {t('admin.preview')}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <X size={16} /> {t('admin.cancel')}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} isLoading={saving}>
            <Save size={16} /> {t('admin.save')}
          </Button>
        </div>
      </div>

      <CardBase variant="default" padding="lg">
        <div className="space-y-6">
          {children}
        </div>
      </CardBase>
    </motion.div>
  );
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-neutral-100 pb-6 last:border-0 dark:border-neutral-700">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-neutral-500">{description}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

export function FormField({ label, error, children, required, className }: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function FormInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none',
        'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        'dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500',
        className,
      )}
      {...props}
    />
  );
}

export function FormSelect({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none',
        'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        'dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function FormTextarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none',
        'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        'dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500',
        'min-h-[100px] resize-y',
        className,
      )}
      {...props}
    />
  );
}
