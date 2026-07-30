import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color?: string;
  onClick?: () => void;
}

export default function StatsCard({ label, value, icon, trend, color = 'text-primary-600', onClick }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        'rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800',
        onClick && 'cursor-pointer',
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/20', color)}>
          {icon}
        </div>
        {trend && (
          <span className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
            trend.positive ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
          )}>
            {trend.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
      <p className="mt-0.5 text-sm text-neutral-500">{label}</p>
    </motion.div>
  );
}
