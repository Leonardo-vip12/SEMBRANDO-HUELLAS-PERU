import { useState } from 'react'
import { Heart, CheckCircle, ClipboardList, Users, Clock, Globe, Send, Quote } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Button from '@/components/buttons/Button'
import CardBase from '@/components/cards/CardBase'
import Input from '@/components/inputs/Input'
import Textarea from '@/components/inputs/Textarea'
import ExpandableCard from '@/components/cards/ExpandableCard'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import faqData from '@/data/json/faq.json'
import testimonialsData from '@/data/json/testimonials.json'

const benefits = [
  { title: 'Experiencia transformadora', description: 'Vive la experiencia de contribuir directamente a la conservación de la Amazonía.', icon: Heart },
  { title: 'Certificación', description: 'Recibes un certificado oficial por tu participación en nuestros programas.', icon: CheckCircle },
  { title: 'Capacitación', description: 'Acceso a talleres y capacitaciones en temas ambientales y de conservación.', icon: ClipboardList },
  { title: 'Red de contactos', description: 'Conoce a personas apasionadas por la naturaleza de todo el mundo.', icon: Users },
  { title: 'Flexibilidad horaria', description: 'Programas de corta y larga duración adaptados a tu disponibilidad.', icon: Clock },
  { title: 'Impacto global', description: 'Tu trabajo contribuye a los objetivos de conservación a nivel mundial.', icon: Globe },
]

const requirements = [
  'Tener 18 años o más (16 con autorización parental)',
  'Compromiso con la conservación ambiental',
  'Disponibilidad de tiempo según el programa elegido',
  'Actitud positiva y trabajo en equipo',
  'Respeto por las comunidades y culturas locales',
]

const steps = [
  { number: '01', title: 'Regístrate', description: 'Completa el formulario de inscripción con tus datos y preferencias.' },
  { number: '02', title: 'Entrevista', description: 'Agendamos una entrevista para conocerte y orientarte al programa ideal.' },
  { number: '03', title: 'Capacitación', description: 'Recibes una inducción sobre seguridad, conservación y trabajo comunitario.' },
  { number: '04', title: '¡Comienza!', description: 'Inicias tu voluntariado acompañado de nuestro equipo experimentado.' },
]

export default function VolunteersPage() {
  const volFaqs = faqData.filter(f => f.category === 'Voluntariado')
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const stories = testimonialsData.filter(t => t.name && t.quote)

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Voluntariado', url: '/voluntariado' }]} />
      <SEO title="Voluntariado" description="Únete como voluntario a Sembrando Huellas Perú y contribuye a la conservación de la Amazonía. Programas de corta y larga duración." />

      <PageHero
        title="Sé parte del cambio"
        subtitle="Tu tiempo y entusiasmo pueden marcar la diferencia en la protección de la Amazonía peruana."
      />

      <Section>
        <Container>
          <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">Beneficios</p><h2 className="mb-12 text-center text-4xl font-bold text-dark-900 md:text-5xl">¿Por qué ser <span className="text-primary-600">voluntario</span>?</h2></Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => {
              const Icon = b.icon
              return (
                <Reveal key={i} direction="up" delay={i * 0.1}>
                  <CardBase variant="default" hover className="group h-full">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-all group-hover:bg-primary-600 group-hover:text-white"><Icon size={28} /></div>
                    <h3 className="mb-2 text-lg font-bold text-dark-800">{b.title}</h3>
                    <p className="text-sm text-neutral-600">{b.description}</p>
                  </CardBase>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-dark-900">
        <Container>
          <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-400 uppercase">Proceso</p><h2 className="mb-12 text-center text-4xl font-bold text-white md:text-5xl">Cómo <span className="text-secondary-400">unirte</span></h2></Reveal>
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={i} direction="up" delay={i * 0.1}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-800/50 text-2xl font-bold text-secondary-400">{s.number}</div>
                  <h3 className="mb-2 text-lg font-bold text-white">{s.title}</h3>
                  <p className="text-sm text-white/80">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">Requisitos</p><h2 className="mb-12 text-center text-4xl font-bold text-dark-900 md:text-5xl">¿Qué <span className="text-primary-600">necesitas</span>?</h2></Reveal>
          <div className="mx-auto max-w-2xl">
            <ul className="space-y-4">
              {requirements.map((r, i) => (
                <Reveal key={i} direction="up" delay={i * 0.05}>
                  <li className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                    <CheckCircle size={20} className="mt-0.5 shrink-0 text-primary-500" />
                    <span className="text-neutral-700">{r}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section className="bg-neutral-50">
        <Container>
          <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">Inscripción</p><h2 className="mb-4 text-center text-4xl font-bold text-dark-900 md:text-5xl">Regístrate como <span className="text-primary-600">voluntario</span></h2><p className="mx-auto mb-8 max-w-2xl text-center text-lg text-neutral-600">Completa el formulario y nos pondremos en contacto contigo.</p></Reveal>

          <div className="mx-auto max-w-2xl">
            <CardBase variant="elevated">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2"><Input label="Nombres" placeholder="Tus nombres" required /><Input label="Apellidos" placeholder="Tus apellidos" required /></div>
                <div className="grid gap-4 sm:grid-cols-2"><Input label="Correo electrónico" type="email" placeholder="tu@correo.com" required /><Input label="Teléfono" type="tel" placeholder="+51 999 999 999" /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Disponibilidad" placeholder="Fines de semana, diario, etc." />
                  <Input label="Programa de interés" placeholder="Reforestación, educación, etc." />
                </div>
                <Textarea label="¿Por qué quieres ser voluntario?" placeholder="Cuéntanos sobre ti y tu motivación..." rows={3} required />
                <Button type="submit" variant="primary" size="lg" fullWidth rightIcon={<Send size={16} />}>Enviar inscripción</Button>
              </form>
            </CardBase>
          </div>
        </Container>
      </Section>

      {stories.length > 0 && (
        <Section>
          <Container>
            <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">Historias</p><h2 className="mb-12 text-center text-4xl font-bold text-dark-900 md:text-5xl">Voluntarios que <span className="text-primary-600">inspiran</span></h2></Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              {stories.slice(0, 2).map((s, i) => (
                <Reveal key={s.id} direction="up" delay={i * 0.1}>
                  <CardBase variant="default" className="h-full">
                    <Quote className="mb-4 h-8 w-8 text-primary-200" />
                    <blockquote className="mb-6 text-sm leading-relaxed text-neutral-600">&ldquo;{s.quote}&rdquo;</blockquote>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">{s.name.charAt(0)}</div>
                      <div><p className="text-sm font-semibold text-dark-800">{s.name}</p><p className="text-xs text-neutral-500">{s.role}</p></div>
                    </div>
                  </CardBase>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section className="bg-neutral-50">
        <Container>
          <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">FAQ</p><h2 className="mb-12 text-center text-4xl font-bold text-dark-900 md:text-5xl">Preguntas <span className="text-primary-600">frecuentes</span></h2></Reveal>
          <div className="mx-auto max-w-3xl space-y-4">
            {volFaqs.length > 0 ? volFaqs.map((faq, i) => (
              <Reveal key={faq.id} direction="up" delay={i * 0.05}>
                <ExpandableCard title={faq.question} preview="" expanded={openFaq === faq.id} onToggle={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}>
                  <p className="text-neutral-600">{faq.answer}</p>
                </ExpandableCard>
              </Reveal>
            )) : (
              <p className="text-center text-neutral-500">Próximamente más información.</p>
            )}
          </div>
        </Container>
      </Section>
    </PageTransition>
  )
}
