import type { LucideIcon } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionTitle from '@/components/ui/SectionTitle'
import Card from '@/components/ui/Card'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  highlight?: boolean
}

interface FeatureSectionProps {
  title?: string
  subtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
}

export default function FeatureSection({
  title,
  subtitle,
  features,
  columns = 3,
}: FeatureSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        {title && <SectionTitle title={title} subtitle={subtitle} />}
        <div
          className={cn(
            'grid grid-cols-1 gap-6',
            columns >= 2 && 'sm:grid-cols-2',
            columns >= 3 && 'lg:grid-cols-3',
            columns >= 4 && 'xl:grid-cols-4'
          )}
        >
          {features.map((feature) => (
            <Card
              key={feature.title}
              className={cn(
                'flex flex-col items-center p-6 text-center transition-shadow hover:shadow-md',
                feature.highlight && 'ring-2 ring-primary-500'
              )}
            >
              {feature.icon && (
                <div className="mb-4 rounded-full bg-primary-100 p-3 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                  <Icon name={feature.icon} size={24} />
                </div>
              )}
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
