import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { InputSize } from '@/types/design-system'

interface SwitchProps {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: InputSize
  id?: string
}

const sizeConfig: Record<
  InputSize,
  { track: string; thumb: string; translateX: number }
> = {
  sm: { track: 'h-5 w-9', thumb: 'h-3.5 w-3.5', translateX: 16 },
  md: { track: 'h-6 w-11', thumb: 'h-4 w-4', translateX: 20 },
  lg: { track: 'h-7 w-14', thumb: 'h-5 w-5', translateX: 28 },
}

const Switch = ({
  label,
  checked,
  onChange,
  disabled = false,
  size = 'md',
  id,
}: SwitchProps) => {
  const switchId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const config = sizeConfig[size]

  return (
    <label
      htmlFor={switchId}
      className={cn(
        'inline-flex cursor-pointer items-center gap-3',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <button
        id={switchId}
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20',
          checked ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600',
          config.track
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'rounded-full bg-white shadow-sm',
            config.thumb
          )}
          style={{
            translateX: checked ? config.translateX : 0,
          }}
        />
      </button>
      {label && (
        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
      )}
    </label>
  )
}

Switch.displayName = 'Switch'
export default Switch
