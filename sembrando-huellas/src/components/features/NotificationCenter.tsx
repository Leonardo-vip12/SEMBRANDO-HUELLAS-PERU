import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/cn';

const variantStyles: Record<string, string> = {
  info: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20',
  success: 'border-l-green-500 bg-green-50 dark:bg-green-900/20',
  warning: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  error: 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
};

export default function NotificationCenter() {
  const { notifications, dismissNotification, clearAll, unreadCount } = useNotifications();

  return (
    <div className="relative">
      <div className="relative">
        <Bell size={20} className="text-neutral-500" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>

      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 space-y-2"
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-medium text-neutral-500">
                {notifications.length} notificaciones
              </span>
              <button
                onClick={clearAll}
                className="text-xs text-primary-500 hover:text-primary-600"
              >
                Limpiar todo
              </button>
            </div>
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className={cn(
                  'flex items-start gap-3 rounded-lg border-l-4 bg-white p-3 shadow-lg dark:bg-neutral-800',
                  variantStyles[notif.variant],
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {notif.title}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {notif.message}
                  </p>
                </div>
                <button
                  onClick={() => dismissNotification(notif.id)}
                  className="shrink-0 rounded p-0.5 text-neutral-400 hover:text-neutral-600"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
