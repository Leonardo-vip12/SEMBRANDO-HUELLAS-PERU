import { useState, useCallback } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  emptyMessage?: string
}

type SortDirection = 'asc' | 'desc' | null

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onSort,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)

  const handleSort = useCallback(
    (key: string) => {
      let newDir: SortDirection = 'asc'
      if (sortKey === key) {
        if (sortDir === 'asc') newDir = 'desc'
        else if (sortDir === 'desc') newDir = null
        else newDir = 'asc'
      }
      setSortKey(newDir ? key : null)
      setSortDir(newDir)
      if (newDir && onSort) {
        onSort(key, newDir)
      }
    },
    [sortKey, sortDir, onSort]
  )

  const SortIcon = ({ column }: { column: Column<T> }) => {
    if (!column.sortable) return null
    const isActive = sortKey === column.key
    if (!isActive || !sortDir) return <ArrowUpDown size={14} className="text-gray-400" aria-hidden="true" />
    return sortDir === 'asc' ? (
      <ArrowUp size={14} className="text-primary-600" aria-hidden="true" />
    ) : (
      <ArrowDown size={14} className="text-primary-600" aria-hidden="true" />
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400',
                  column.sortable && 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200'
                )}
                onClick={() => column.sortable && handleSort(column.key)}
                aria-sort={
                  sortKey === column.key
                    ? sortDir === 'asc'
                      ? 'ascending'
                      : sortDir === 'desc'
                        ? 'descending'
                        : 'none'
                    : undefined
                }
              >
                <div className="inline-flex items-center gap-1">
                  {column.label}
                  <SortIcon column={column} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                  >
                    {column.render
                      ? column.render(row)
                      : (row[column.key] as React.ReactNode) ?? '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
