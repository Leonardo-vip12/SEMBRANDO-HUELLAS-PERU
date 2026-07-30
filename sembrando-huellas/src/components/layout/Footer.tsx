import { Link } from 'react-router-dom'
import { useConfig } from '@/contexts/ConfigContext'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'
import { MapPin, Mail, Phone } from 'lucide-react'
import organizationData from '@/data/json/organization.json'
import programsData from '@/data/json/programs.json'


interface FooterProps {
  className?: string
}

const currentYear = new Date().getFullYear()

export default function Footer({ className }: FooterProps) {
  const { t } = useTranslation()
  const { siteConfig } = useConfig()
  const programs = programsData.filter(p => p.title).slice(0, 5)

  return (
    <footer className={cn('bg-dark-950 text-white', className)}>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">
              Sembrando <span className="text-secondary-400">Huellas</span> Perú
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-white/70">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {Object.entries(organizationData.socialMedia || {}).map(([platform, url]) => {
                if (!url) return null
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-all hover:bg-primary-600 hover:text-white"
                    aria-label={platform}
                  >
                    <span className="text-xs font-bold uppercase">{platform.charAt(0)}</span>
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-widest text-white/60 uppercase">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {[
                { label: t('nav.home'), to: '/' },
                { label: t('nav.about'), to: '/nosotros' },
                { label: t('nav.programs'), to: '/programas' },
                { label: t('nav.projects'), to: '/proyectos' },
                { label: t('nav.volunteers'), to: '/voluntariado' },
                { label: t('nav.news'), to: '/noticias' },
                { label: t('nav.contact'), to: '/contacto' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-widest text-white/60 uppercase">
              {t('nav.programs')}
            </h4>
            <ul className="space-y-3">
              {programs.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/programas/${p.slug}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-widest text-white/60 uppercase">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-secondary-400" />
                <span>{organizationData.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-secondary-400" />
                <a href={`mailto:${organizationData.email}`} className="hover:text-white">
                  {organizationData.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-secondary-400" />
                <a href={`tel:${organizationData.phone}`} className="hover:text-white">
                  {organizationData.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row">
            <p className="text-sm text-white/60">
              &copy; {currentYear} {siteConfig.name}. {t('footer.rights')}.
            </p>
            <div className="flex gap-6 text-xs text-white/60">
              <Link to="/politicas" className="hover:text-white">{t('footer.privacy')}</Link>
              <Link to="/terminos" className="hover:text-white">{t('footer.terms')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
