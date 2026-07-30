import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';

type StatusType = 'published' | 'draft' | 'archived' | 'pending' | 'active' | 'inactive' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

const statusStyles: Record<StatusType, string> = {
  published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  draft: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  archived: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  inactive: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500',
  upcoming: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  ongoing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

interface StatusBadgeProps {
  status: StatusType | string;
  customLabel?: string;
  className?: string;
}

export default function StatusBadge({ status, customLabel, className }: StatusBadgeProps) {
  const { t } = useTranslation();
  const statusLabels: Record<string, string> = {
    published: t('admin.published'),
    draft: t('admin.draft'),
    archived: t('admin.archived'),
    pending: t('admin.pending'),
    active: t('admin.active'),
    inactive: t('admin.inactive'),
    upcoming: t('admin.upcoming'),
    ongoing: t('admin.ongoing'),
    completed: t('admin.completed'),
    cancelled: t('admin.cancelled'),
  };
  const style = statusStyles[status as StatusType] || 'bg-neutral-100 text-neutral-600';
  const label = customLabel || statusLabels[status] || status;
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', style, className)}>
      {label}
    </span>
  );
}
