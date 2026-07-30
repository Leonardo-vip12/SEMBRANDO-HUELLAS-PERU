import { Plus, Download, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/buttons/Button';

interface PageHeaderProps {
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
  onExport?: () => void;
  onImport?: () => void;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, onAdd, addLabel, onExport, onImport, children }: PageHeaderProps) {
  const { t } = useTranslation();
  const createLabel = addLabel || t('admin.create');
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{title}</h1>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {onImport && (
          <Button variant="outline" size="sm" onClick={onImport}>
            <Upload size={16} />
            {t('admin.import')}
          </Button>
        )}
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download size={16} />
            {t('admin.export')}
          </Button>
        )}
        {onAdd && (
          <Button variant="primary" size="sm" onClick={onAdd}>
            <Plus size={16} />
            {createLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
