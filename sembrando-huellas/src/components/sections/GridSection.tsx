import Container from '@/components/ui/Container'
import SectionTitle from '@/components/ui/SectionTitle'
import { cn } from '@/lib/cn'

interface GridSectionProps {
  title?: string
  subtitle?: string
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

const gapStyles: Record<string, string> = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
}

export default function GridSection({
  title,
  subtitle,
  columns = 3,
  gap = 'md',
  children,
  className,
}: GridSectionProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <Container>
        {title && <SectionTitle title={title} subtitle={subtitle} />}
        <div
          className={cn(
            'grid grid-cols-1',
            columns >= 2 && 'sm:grid-cols-2',
            columns >= 3 && 'lg:grid-cols-3',
            columns >= 4 && 'xl:grid-cols-4',
            gapStyles[gap]
          )}
        >
          {children}
        </div>
      </Container>
    </section>
  )
}
