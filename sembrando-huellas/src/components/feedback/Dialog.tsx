import { forwardRef } from 'react'

import { AlertTriangle, Info, XCircle, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import Modal from './Modal'

type DialogVariant = 'info' | 'warning' | 'error' | 'success'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  variant?: DialogVariant
  isLoading?: boolean
}

const variantIcons: Record<DialogVariant, { icon: React.ReactNode; color: string }> = {
  info: { icon: <Info size={24} />, color: 'text-info-500' },
  warning: { icon: <AlertTriangle size={24} />, color: 'text-yellow-500' },
  error: { icon: <XCircle size={24} />, color: 'text-red-500' },
  success: { icon: <CheckCircle size={24} />, color: 'text-green-500' },
}

const variantButton: Record<DialogVariant, string> = {
  info: 'bg-info-600 hover:bg-info-700 text-white',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  error: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      isOpen,
      onClose,
      title,
      message,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      onConfirm,
      variant = 'info',
      isLoading = false,
    },
    ref
  ) => {
    const { icon, color } = variantIcons[variant]

    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
        <div ref={ref} className="flex flex-col items-center text-center">
          <div className={cn('mb-4 rounded-full bg-neutral-100 p-3 dark:bg-neutral-800', color)}>
            {icon}
          </div>
          <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
          <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">{message}</p>
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50',
                variantButton[variant]
              )}
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </Modal>
    )
  }
)

Dialog.displayName = 'Dialog'

export default Dialog
