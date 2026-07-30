import { useState, useRef, useEffect, forwardRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SearchBarProps {
  onSearch: (value: string) => void
  placeholder?: string
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onSearch, placeholder = 'Search...' }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [value, setValue] = useState('')
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (value.trim()) {
        onSearch(value.trim())
      }
    }

    const handleClear = () => {
      setValue('')
      inputRef.current?.focus()
    }

    const handleCollapse = () => {
      setIsExpanded(false)
      setValue('')
    }

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (isMobileOpen) {
            setIsMobileOpen(false)
          } else if (isExpanded) {
            handleCollapse()
          }
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isExpanded, isMobileOpen])

    useEffect(() => {
      if (isExpanded && inputRef.current) {
        inputRef.current.focus()
      }
    }, [isExpanded])

    return (
      <>
        <div
          ref={containerRef}
          className="relative hidden md:block"
        >
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className={cn(
                'rounded-lg p-2 transition-colors',
                'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
              )}
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center">
              <div className="flex items-center rounded-lg border border-neutral-300 bg-white px-3 dark:border-neutral-600 dark:bg-neutral-800">
                <Search size={16} className="text-neutral-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  className="ml-2 w-48 bg-transparent py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none dark:text-neutral-100 dark:placeholder-neutral-500"
                  aria-label="Search"
                />
                {value && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="ml-1 rounded p-0.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleCollapse}
                className="ml-2 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </form>
          )}
        </div>

        <button
          onClick={() => setIsMobileOpen(true)}
          className={cn(
            'rounded-lg p-2 transition-colors md:hidden',
            'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
          )}
          aria-label="Open search"
        >
          <Search size={20} />
        </button>

        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex items-start bg-white px-4 pt-4 dark:bg-neutral-900 md:hidden">
            <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
              <div className="flex flex-1 items-center rounded-lg border border-neutral-300 bg-neutral-50 px-3 dark:border-neutral-600 dark:bg-neutral-800">
                <Search size={18} className="text-neutral-400" />
                <input
                  ref={ref}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  className="ml-2 w-full bg-transparent py-3 text-base text-neutral-900 placeholder-neutral-400 outline-none dark:text-neutral-100 dark:placeholder-neutral-500"
                  aria-label="Search"
                  autoFocus
                />
                {value && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="ml-1 rounded p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false)
                  setValue('')
                }}
                className="rounded-lg p-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                aria-label="Close search"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </>
    )
  }
)

SearchBar.displayName = 'SearchBar'

export default SearchBar
