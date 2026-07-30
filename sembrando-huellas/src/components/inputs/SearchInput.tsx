import { forwardRef, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { InputHTMLAttributes, KeyboardEvent } from 'react'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
  onClear?: () => void
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onClear, placeholder = 'Buscar...', className, value, onChange, ...props }, ref) => {
    const handleClear = useCallback(() => {
      onClear?.()
      if (onChange) {
        const event = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }
    }, [onClear, onChange])

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch && typeof value === 'string') {
        onSearch(value)
      }
      props.onKeyDown?.(e)
    }

    const hasValue = typeof value === 'string' && value.length > 0

    return (
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400 dark:text-neutral-500">
          <Search size={18} />
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 transition-colors',
            'placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500',
            className
          )}
          {...props}
          onKeyDown={handleKeyDown}
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            aria-label="Limpiar búsqueda"
          >
            <X size={18} />
          </button>
        )}
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
export default SearchInput
