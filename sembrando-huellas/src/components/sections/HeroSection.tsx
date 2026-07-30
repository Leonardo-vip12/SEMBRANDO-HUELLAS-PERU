import { cn } from '@/lib/cn'

interface CTA {
  label: string
  href: string
}

interface HeroSectionProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  overlay?: string
  cta?: CTA
  secondaryCta?: CTA
  alignment?: 'left' | 'center'
  className?: string
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  overlay = 'from-black/60 to-black/40',
  cta,
  secondaryCta,
  alignment = 'center',
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative flex min-h-screen items-center overflow-hidden',
        className
      )}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          role="img"
          aria-label={title}
        />
      )}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r',
          overlay
        )}
      />
      <div
        className={cn(
          'relative z-10 mx-auto max-w-7xl px-4 py-32',
          alignment === 'center' && 'text-center',
          alignment === 'left' && 'text-left'
        )}
      >
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              'mt-6 max-w-2xl text-lg text-gray-200 md:text-xl',
              alignment === 'center' && 'mx-auto'
            )}
          >
            {subtitle}
          </p>
        )}
        {(cta || secondaryCta) && (
          <div
            className={cn(
              'mt-10 flex flex-col gap-4 sm:flex-row',
              alignment === 'center' && 'justify-center'
            )}
          >
            {cta && (
              <a
                href={cta.href}
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {cta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
