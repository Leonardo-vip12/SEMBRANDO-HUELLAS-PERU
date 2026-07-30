import { cn } from '@/lib/cn'

interface PageHeroProps {
  title: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'min-h-[30vh] py-16',
  md: 'min-h-[40vh] py-24',
  lg: 'min-h-[50vh] py-32',
}

export default function PageHero({ title, subtitle, size = 'md', className }: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-800 via-dark-800 to-dark-900',
        sizeClasses[size],
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(45,106,79,0.3),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(27,67,50,0.4),transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-neutral-200 md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
