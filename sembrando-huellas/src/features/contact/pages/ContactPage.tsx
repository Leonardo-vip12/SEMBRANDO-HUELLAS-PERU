import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Button from '@/components/buttons/Button'
import CardBase from '@/components/cards/CardBase'
import Input from '@/components/inputs/Input'
import Textarea from '@/components/inputs/Textarea'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import organizationData from '@/data/json/organization.json'

const contactChannels = [
  { icon: MapPin, title: 'Dirección', value: organizationData.address },
  { icon: Mail, title: 'Correo electrónico', value: organizationData.email, href: `mailto:${organizationData.email}` },
  { icon: Phone, title: 'Teléfono', value: organizationData.phone, href: `tel:${organizationData.phone}` },
  { icon: Clock, title: 'Horario', value: organizationData.contactInfo?.horario || 'Lun - Vie: 9:00 AM - 6:00 PM' },
]

export default function ContactPage() {
  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Contacto', url: '/contacto' }]} />
      <SEO title="Contacto" description="Ponte en contacto con Sembrando Huellas Perú. Estamos ubicados en Lima y trabajamos en toda la Amazonía peruana." />

      <PageHero
        title="Hablemos"
        subtitle="Estamos aquí para responder tus preguntas y escuchar tus ideas."
      />

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal direction="left">
              <div className="space-y-6">
                <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 via-accent-50 to-secondary-100 shadow-sm" />

                <div className="grid gap-4">
                  {contactChannels.map((ch, i) => {
                    const Icon = ch.icon
                    return (
                      <CardBase key={i} variant="flat" className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600"><Icon size={22} /></div>
                        <div>
                          <p className="text-sm font-semibold text-dark-800">{ch.title}</p>
                          {ch.href ? (
                            <a href={ch.href} className="text-sm text-neutral-600 hover:text-primary-600">{ch.value}</a>
                          ) : (
                            <p className="text-sm text-neutral-600">{ch.value}</p>
                          )}
                        </div>
                      </CardBase>
                    )
                  })}
                </div>

                <div className="flex gap-3">
                  {Object.entries(organizationData.socialMedia || {}).filter(([_, url]) => url).map(([platform, url]) => (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 transition-colors hover:bg-primary-100 hover:text-primary-600" aria-label={platform}>
                      <span className="text-xs font-bold uppercase">{platform.charAt(0)}</span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <CardBase variant="elevated" className="h-full">
                <h2 className="mb-6 text-2xl font-bold text-dark-900">Envíanos un mensaje</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Nombre" placeholder="Tu nombre" required />
                    <Input label="Correo" type="email" placeholder="tu@correo.com" required />
                  </div>
                  <Input label="Asunto" placeholder="¿Sobre qué quieres hablarnos?" />
                  <Textarea label="Mensaje" placeholder="Cuéntanos más..." rows={5} required />
                  <Button type="submit" variant="primary" size="lg" fullWidth rightIcon={<Send size={16} />}>Enviar mensaje</Button>
                </form>
              </CardBase>
            </Reveal>
          </div>
        </Container>
      </Section>
    </PageTransition>
  )
}
