import { useState, useCallback } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

interface TreeNode {
  id: string
  label: string
  icon?: LucideIcon
  children?: TreeNode[]
}

interface TreeViewProps {
  items: TreeNode[]
  defaultExpanded?: string[]
  onSelect?: (node: TreeNode) => void
}

function TreeItem({
  node,
  depth,
  defaultExpanded,
  onSelect,
}: {
  node: TreeNode
  depth: number
  defaultExpanded: Set<string>
  onSelect?: (node: TreeNode) => void
}) {
  const [expanded, setExpanded] = useState(defaultExpanded.has(node.id))
  const hasChildren = node.children && node.children.length > 0

  const toggle = useCallback(() => {
    if (hasChildren) {
      setExpanded((prev) => !prev)
    }
  }, [hasChildren])

  const handleSelect = useCallback(() => {
    onSelect?.(node)
  }, [node, onSelect])

  return (
    <div>
      <button
        onClick={hasChildren ? toggle : handleSelect}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-gray-800',
          !hasChildren && 'ml-5'
        )}
        aria-expanded={hasChildren ? expanded : undefined}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown size={16} className="shrink-0 text-gray-500" />
          ) : (
            <ChevronRight size={16} className="shrink-0 text-gray-500" />
          )
        ) : (
          <span className="w-4" />
        )}
        {node.icon && <Icon name={node.icon} size={16} className="shrink-0 text-gray-500" />}
        <span>{node.label}</span>
      </button>
      {hasChildren && expanded && (
        <div role="group">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              defaultExpanded={defaultExpanded}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function TreeView({
  items,
  defaultExpanded = [],
  onSelect,
}: TreeViewProps) {
  const expandedSet = new Set(defaultExpanded)

  return (
    <div
      className="rounded-lg border border-gray-200 p-2 dark:border-gray-700"
      role="tree"
    >
      {items.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          depth={0}
          defaultExpanded={expandedSet}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
