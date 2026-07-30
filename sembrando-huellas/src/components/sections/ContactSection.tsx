import { Mail, Phone, MapPin } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionTitle from '@/components/ui/SectionTitle'

interface SocialLink {
  label: string
  href: string
  icon: React.ReactNode
}

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'textarea' | 'tel'
  placeholder?: string
  required?: boolean
}

interface ContactSectionProps {
  title?: string
  subtitle?: string
  address?: string
  phone?: string
  email?: string
  socialLinks?: SocialLink[]
  formFields?: FormField[]
}

export default function ContactSection({
  title,
  subtitle,
  address,
  phone,
  email,
  socialLinks,
  formFields,
}: ContactSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        {title && <SectionTitle title={title} subtitle={subtitle} />}
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Get in Touch</h3>
            <div className="space-y-4">
              {address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 shrink-0 text-primary-600" size={20} aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">{address}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-3">
                  <Phone className="shrink-0 text-primary-600" size={20} aria-hidden="true" />
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-primary-600 dark:text-gray-400">
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3">
                  <Mail className="shrink-0 text-primary-600" size={20} aria-hidden="true" />
                  <a href={`mailto:${email}`} className="text-gray-600 hover:text-primary-600 dark:text-gray-400">
                    {email}
                  </a>
                </div>
              )}
            </div>
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex gap-4 pt-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-primary-100 hover:text-primary-600 dark:bg-gray-800 dark:text-gray-400"
                    aria-label={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
          {formFields && formFields.length > 0 && (
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
              noValidate
            >
              {formFields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={`contact-${field.name}`}
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {field.label}
                    {field.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={`contact-${field.name}`}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={`contact-${field.name}`}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  )
}
