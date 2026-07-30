import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

interface SocialLink {
  icon: React.ReactNode
  href: string
}

interface FooterProps {
  columns: FooterColumn[]
  socialLinks: SocialLink[]
  copyright: string
  logo: React.ReactNode
  className?: string
}

const Footer = forwardRef<HTMLElement, FooterProps>(
  ({ columns, socialLinks, copyright, logo, className }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(
          'bg-gray-900 text-gray-300 dark:bg-black',
          className
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4">{logo}</div>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                    aria-label={`Visit us on ${social.href}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            <p>{copyright}</p>
          </div>
        </div>
      </footer>
    )
  }
)

Footer.displayName = 'Footer'

export default Footer
