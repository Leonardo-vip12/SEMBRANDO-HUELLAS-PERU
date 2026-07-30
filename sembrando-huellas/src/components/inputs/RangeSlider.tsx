import { useCallback } from 'react'
import { cn } from '@/lib/cn'

interface RangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  label?: string
  formatValue?: (value: number) => string
  disabled?: boolean
  className?: string
}

const RangeSlider = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  formatValue = (v) => String(v),
  disabled = false,
  className,
}: RangeSliderProps) => {
  const minVal = value[0]
  const maxVal = value[1]

  const getPercent = useCallback(
    (val: number) => ((val - min) / (max - min)) * 100,
    [min, max]
  )

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(Number(e.target.value), maxVal - step)
    onChange([v, maxVal])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(Number(e.target.value), minVal + step)
    onChange([minVal, v])
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
      )}
      <div className="relative flex h-6 items-center">
        <div className="absolute h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div
          className="absolute h-1.5 rounded-full bg-primary-500"
          style={{
            left: `${getPercent(minVal)}%`,
            width: `${getPercent(maxVal) - getPercent(minVal)}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          disabled={disabled}
          onChange={handleMinChange}
          className={cn(
            'pointer-events-none absolute z-10 h-full w-full appearance-none bg-transparent',
            '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:hover:border-primary-600 [&::-webkit-slider-thumb]:focus-visible:ring-2 [&::-webkit-slider-thumb]:focus-visible:ring-primary-500/20',
            'dark:[&::-webkit-slider-thumb]:border-primary-400 dark:[&::-webkit-slider-thumb]:bg-neutral-800',
            '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm',
            disabled && 'opacity-50'
          )}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          disabled={disabled}
          onChange={handleMaxChange}
          className={cn(
            'pointer-events-none absolute z-20 h-full w-full appearance-none bg-transparent',
            '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:hover:border-primary-600 [&::-webkit-slider-thumb]:focus-visible:ring-2 [&::-webkit-slider-thumb]:focus-visible:ring-primary-500/20',
            'dark:[&::-webkit-slider-thumb]:border-primary-400 dark:[&::-webkit-slider-thumb]:bg-neutral-800',
            '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm',
            disabled && 'opacity-50'
          )}
        />
      </div>
      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>{formatValue(minVal)}</span>
        <span>{formatValue(maxVal)}</span>
      </div>
    </div>
  )
}

RangeSlider.displayName = 'RangeSlider'
export default RangeSlider
