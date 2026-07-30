import { useState } from 'react'
import Container from '@/components/ui/Container'
import { cn } from '@/lib/cn'

interface NewsletterSectionProps {
  title?: string
  description?: string
  placeholder?: string
  buttonLabel?: string
  onSubmit?: (email: string) => void
  className?: string
}

export default function NewsletterSection({
  title = 'Stay Updated',
  description = 'Subscribe to our newsletter for the latest updates.',
  placeholder = 'Enter your email',
  buttonLabel = 'Subscribe',
  onSubmit,
  className,
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && onSubmit) {
      onSubmit(email)
      setEmail('')
    }
  }

  return (
    <section
      className={cn(
        'bg-primary-600 py-16 text-white md:py-24',
        className
      )}
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
          {description && (
            <p className="mt-4 text-lg text-white/80">{description}</p>
          )}
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
              className="flex-1 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {buttonLabel}
            </button>
          </form>
        </div>
      </Container>
    </section>
  )
}
