import { useState, useMemo } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionTitle from '@/components/ui/SectionTitle'
import { cn } from '@/lib/cn'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  title?: string
  subtitle?: string
  items: FAQItem[]
  allowMultiple?: boolean
}

export default function FAQSection({
  title,
  subtitle,
  items,
  allowMultiple = false,
}: FAQSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [items, searchQuery]
  )

  const toggleItem = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) {
          next.clear()
        }
        next.add(id)
      }
      return next
    })
  }

  return (
    <section className="py-16 md:py-24">
      <Container>
        {title && <SectionTitle title={title} subtitle={subtitle} />}
        <div className="mx-auto max-w-3xl">
          <div className="relative mb-8">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              aria-label="Search frequently asked questions"
            />
          </div>
          <div className="space-y-2">
            {filteredItems.map((item, index) => {
              const isExpanded = expandedIds.has(index)
              return (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                    aria-expanded={isExpanded}
                    aria-controls={`faq-panel-${index}`}
                  >
                    <span className="text-base font-medium">{item.question}</span>
                    <ChevronDown
                      size={20}
                      className={cn(
                        'shrink-0 text-gray-500 transition-transform duration-200',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    className={cn(
                      'overflow-hidden transition-all duration-300',
                      isExpanded ? 'max-h-96' : 'max-h-0'
                    )}
                  >
                    <div className="border-t border-gray-200 px-6 py-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredItems.length === 0 && (
              <p className="py-8 text-center text-gray-500">
                No results found for &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
