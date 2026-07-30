import { cn } from '@/lib/cn'
import Modal from './Modal'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  variant?: 'info' | 'warning' | 'error'
}

export default function Dialog({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'info',
}: DialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-6 text-sm text-gray-600">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm?.()
              onClose()
            }}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
              variant === 'error' && 'bg-red-600 hover:bg-red-700',
              variant === 'warning' && 'bg-yellow-600 hover:bg-yellow-700',
              variant === 'info' && 'bg-primary-600 hover:bg-primary-700'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
