import { useState, useCallback } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
  icon?: LucideIcon
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: 'underline' | 'pills' | 'buttons'
}

const variantStyles = {
  underline:
    'border-b-2 border-transparent text-gray-500 hover:text-gray-700 data-[active=true]:border-primary-600 data-[active=true]:text-primary-600 pb-3',
  pills:
    'rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 data-[active=true]:bg-primary-600 data-[active=true]:text-white',
  buttons:
    'rounded-lg border border-gray-300 px-4 py-2 text-gray-500 hover:bg-gray-50 data-[active=true]:bg-primary-600 data-[active=true]:border-primary-600 data-[active=true]:text-white',
}

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? '')

  const handleTabClick = useCallback(
    (tabId: string) => {
      setActiveTab(tabId)
      onChange?.(tabId)
    },
    [onChange]
  )

  const activeTabContent = tabs.find((t) => t.id === activeTab)?.content

  return (
    <div>
      <div
        className={cn(
          'flex gap-1',
          variant === 'underline' ? 'border-b border-gray-200 dark:border-gray-700' : '',
          variant === 'pills' ? 'flex-wrap gap-2' : '',
          variant === 'buttons' ? 'flex-wrap gap-2' : ''
        )}
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              data-active={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                variantStyles[variant]
              )}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              {Icon && <Icon size={16} aria-hidden="true" />}
              {tab.label}
            </button>
          )
        })}
      </div>
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="mt-4"
      >
        {activeTabContent}
      </div>
    </div>
  )
}
