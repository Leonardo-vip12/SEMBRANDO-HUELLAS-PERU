import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { InputSize } from '@/types/design-system'

interface AutocompleteOption {
  label: string
  value: string
}

interface AutocompleteProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'onSelect' | 'size'> {
  label?: string
  error?: string
  options: AutocompleteOption[]
  onOptionSelect: (option: AutocompleteOption) => void
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
  maxSuggestions?: number
  size?: InputSize
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-4 py-3 text-base',
}

const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      label,
      error,
      options,
      onOptionSelect,
      value,
      onChange,
      isLoading = false,
      maxSuggestions = 6,
      size = 'md',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const resolvedRef = (ref || inputRef) as React.RefObject<HTMLInputElement | null>

    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const listboxId = `${inputId}-listbox`
    const errorId = inputId ? `${inputId}-error` : undefined

    const filtered = options
      .filter((opt) =>
        opt.label.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, maxSuggestions)

    const handleSelect = useCallback(
      (option: AutocompleteOption) => {
        onOptionSelect(option)
        onChange(option.label)
        setIsOpen(false)
        setHighlightedIndex(-1)
      },
      [onOptionSelect, onChange]
    )

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1
        )
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault()
        handleSelect(filtered[highlightedIndex])
      } else if (e.key === 'Escape') {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    useEffect(() => {
      if (!isOpen) setHighlightedIndex(-1)
    }, [isOpen])

    useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const item = listRef.current.children[highlightedIndex] as HTMLElement
        item?.scrollIntoView({ block: 'nearest' })
      }
    }, [highlightedIndex])

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const showDropdown = isOpen && value.length > 0 && filtered.length > 0

    return (
      <div ref={containerRef} className="relative flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={resolvedRef}
            id={inputId}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => value.length > 0 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            aria-autocomplete="list"
            aria-controls={showDropdown ? listboxId : undefined}
            aria-expanded={showDropdown}
            aria-activedescendant={
              highlightedIndex >= 0
                ? `${listboxId}-${highlightedIndex}`
                : undefined
            }
            role="combobox"
            className={cn(
              'w-full rounded-lg border bg-white transition-colors',
              'text-neutral-900 placeholder-neutral-400 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500',
              'focus:outline-none focus:ring-2',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-neutral-600',
              'pr-10',
              sizeClasses[size],
              className
            )}
            {...props}
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 dark:text-neutral-500">
              <Loader2 size={18} className="animate-spin" />
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {showDropdown && (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
          >
            {filtered.map((opt, index) => (
              <li
                key={opt.value}
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseDown={() => handleSelect(opt)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  'cursor-pointer px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300',
                  index === highlightedIndex &&
                    'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                )}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
)

Autocomplete.displayName = 'Autocomplete'
export default Autocomplete
