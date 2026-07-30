import Container from '@/components/ui/Container'
import { cn } from '@/lib/cn'

interface CTA {
  label: string
  href: string
}

interface CTASectionProps {
  title: string
  description?: string
  primaryCta: CTA
  secondaryCta?: CTA
  background?: 'primary' | 'dark' | 'accent'
  className?: string
}

const backgroundStyles: Record<string, string> = {
  primary: 'bg-primary-600',
  dark: 'bg-gray-900',
  accent: 'bg-amber-600',
}

export default function CTASection({
  title,
  description,
  primaryCta,
  secondaryCta,
  background = 'primary',
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        'py-20 text-white',
        backgroundStyles[background],
        className
      )}
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
          {description && (
            <p className="mt-4 text-lg text-white/80">{description}</p>
          )}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={primaryCta.href}
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              {primaryCta.label}
            </a>
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
