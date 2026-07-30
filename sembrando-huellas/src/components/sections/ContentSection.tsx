import Container from '@/components/ui/Container'
import SectionTitle from '@/components/ui/SectionTitle'
import { cn } from '@/lib/cn'

interface ContentSectionProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  background?: 'light' | 'dark' | 'primary' | 'none'
}

const backgroundStyles: Record<string, string> = {
  light: 'bg-gray-50 dark:bg-gray-900',
  dark: 'bg-gray-900 text-white dark:bg-black',
  primary: 'bg-primary-600 text-white',
  none: '',
}

export default function ContentSection({
  title,
  subtitle,
  children,
  className,
  background = 'none',
}: ContentSectionProps) {
  return (
    <section className={cn('py-16 md:py-24', backgroundStyles[background], className)}>
      <Container>
        {title && <SectionTitle title={title} subtitle={subtitle} />}
        {children}
      </Container>
    </section>
  )
}
