import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Eye, Lightbulb, Users, Leaf, ArrowRight, Quote, TreePine, Target, Globe } from 'lucide-react'
import { SEO, OrganizationSchema, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Button from '@/components/buttons/Button'
import CardBase from '@/components/cards/CardBase'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import Image from '@/components/visual/Image'
import organizationData from '@/data/json/organization.json'
import impactData from '@/data/json/impact.json'
import partnersData from '@/data/json/partners.json'
import teamData from '@/data/json/team.json'
import testimonialsData from '@/data/json/testimonials.json'

const iconMap: Record<string, React.ElementType> = { Heart, Eye, Lightbulb, Users, Leaf, Target, Globe, TreePine }

function resolveIcon(name: string): React.ElementType {
  return iconMap[name] || Leaf
}

const timeline = (impactData.timeline || []).filter(t => t.year)

function TimelineSection() {
  return (
    <Section className="bg-neutral-50">
      <Container>
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">Nuestra Evolución</p>
          <h2 className="mb-16 text-center text-4xl font-bold text-dark-900 md:text-5xl">Cómo <span className="text-primary-600">hemos crecido</span></h2>
        </Reveal>

        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-primary-200 md:left-1/2 md:-translate-x-px" />

          {timeline.map((item, i) => (
            <div key={i} className={`relative mb-12 flex flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <Reveal direction={i % 2 === 0 ? 'left' : 'right'}>
                  <CardBase variant="default" className="inline-block">
                    <p className="mb-1 text-2xl font-bold text-primary-600">{item.year}</p>
                    <h3 className="mb-2 text-lg font-bold text-dark-800">{item.title}</h3>
                    <p className="text-sm text-neutral-600">{item.description}</p>
                  </CardBase>
                </Reveal>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-primary-200 bg-white md:h-10 md:w-10">
                  <div className="h-3 w-3 rounded-full bg-primary-600" />
                </div>
              </div>
              <div className="flex-1" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function TeamSection() {
  const team = teamData.filter(t => t.firstName)

  return (
    <Section>
      <Container>
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">Equipo</p>
          <h2 className="mb-4 text-center text-4xl font-bold text-dark-900 md:text-5xl">Las personas detrás del <span className="text-primary-600">cambio</span></h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-neutral-600">
            Conoce al equipo multidisciplinario que hace posible cada proyecto de conservación en la Amazonía peruana.
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <Reveal key={member.id} direction="up" delay={i * 0.1}>
              <CardBase variant="elevated" className="group text-center">
                <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-primary-100">
                  {member.photo ? (
                    <Image src={member.photo} alt={`${member.firstName} ${member.lastName}`} className="h-full w-full" />
                  ) : (
                    <span className="text-3xl font-bold text-primary-600">{member.firstName.charAt(0)}{member.lastName.charAt(0)}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-dark-800">{member.firstName} {member.lastName}</h3>
                <p className="mb-3 text-sm font-medium text-primary-600">{member.role}</p>
                <p className="text-sm text-neutral-600">{member.bio}</p>
              </CardBase>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function ValuesSection() {
  const values = organizationData.values || []

  return (
    <Section className="bg-dark-900">
      <Container>
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-400 uppercase">Valores</p>
          <h2 className="mb-4 text-center text-4xl font-bold text-white md:text-5xl">Nuestros <span className="text-secondary-400">principios</span></h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-white/80">
            Cinco valores fundamentales que guían cada decisión y acción de nuestra organización.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {values.map((v, i) => {
            const Icon = resolveIcon(v.icon || 'Leaf')
            return (
              <Reveal key={i} direction="up" delay={i * 0.08}>
                <CardBase variant="default" hover className="group border-primary-800/30 bg-white/5 text-center backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-800/50 text-secondary-400 transition-all group-hover:bg-primary-600 group-hover:text-white">
                    <Icon size={28} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{v.title}</h3>
                  <p className="text-sm text-white/80">{v.description}</p>
                </CardBase>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

export default function AboutPage() {
  const partners = partnersData.filter(p => p.name && p.logo)
  const duplicated = [...partners, ...partners]
  const testimonials = testimonialsData.filter(t => t.name && t.quote)

  return (
    <PageTransition>
      <OrganizationSchema />
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Nosotros', url: '/nosotros' }]} />
      <SEO title="Nosotros" description="Conoce la historia, misión, visión y equipo de Sembrando Huellas Perú. Organización peruana dedicada a la conservación de la Amazonía." />

      <PageHero
        title="Nuestra Historia"
        subtitle="Conoce nuestro origen, nuestro equipo y los valores que nos impulsan a proteger la Amazonía peruana."
        size="lg"
      />

      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal direction="left">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100">
                <div className="flex h-full w-full items-center justify-center"><TreePine size={80} className="text-primary-300" /></div>
              </div>
            </Reveal>
            <div>
              <Reveal direction="right">
                <p className="mb-2 text-sm font-semibold tracking-widest text-secondary-600 uppercase">Nuestra Historia</p>
                <h2 className="mb-6 text-3xl font-bold text-dark-900 md:text-4xl">Un sueño que <span className="text-primary-600">crece</span> desde 2018</h2>
                <p className="mb-6 text-lg leading-relaxed text-neutral-600">{organizationData.foundingStory}</p>
                <p className="text-lg leading-relaxed text-neutral-600">{organizationData.description}</p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-neutral-50">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <Reveal direction="left">
              <CardBase variant="elevated" className="h-full">
                <Target size={32} className="mb-4 text-primary-600" />
                <h3 className="mb-4 text-2xl font-bold text-dark-800">Misión</h3>
                <p className="leading-relaxed text-neutral-600">{organizationData.mission}</p>
              </CardBase>
            </Reveal>
            <Reveal direction="right">
              <CardBase variant="elevated" className="h-full">
                <Globe size={32} className="mb-4 text-primary-600" />
                <h3 className="mb-4 text-2xl font-bold text-dark-800">Visión</h3>
                <p className="leading-relaxed text-neutral-600">{organizationData.vision}</p>
              </CardBase>
            </Reveal>
          </div>
        </Container>
      </Section>

      <ValuesSection />
      <TimelineSection />
      <TeamSection />

      {testimonials.length > 0 && (
        <Section className="bg-neutral-50">
          <Container>
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">Testimonios</p>
                <h2 className="mb-12 text-center text-4xl font-bold text-dark-900 md:text-5xl">Lo que dicen de <span className="text-primary-600">nosotros</span></h2>
              </Reveal>
              <div className="grid gap-6 md:grid-cols-2">
                {testimonials.slice(0, 2).map((t, i) => (
                  <Reveal key={t.id} direction="up" delay={i * 0.1}>
                    <CardBase variant="default">
                      <Quote className="mb-4 h-8 w-8 text-primary-200" />
                      <blockquote className="mb-6 text-sm leading-relaxed text-neutral-600">&ldquo;{t.quote}&rdquo;</blockquote>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-bold">{t.name.charAt(0)}</div>
                        <div><p className="text-sm font-semibold text-dark-800">{t.name}</p><p className="text-xs text-neutral-500">{t.role}</p></div>
                      </div>
                    </CardBase>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {partners.length > 0 && (
        <Section className="overflow-hidden">
          <Container><Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">Aliados</p><h2 className="mb-12 text-center text-4xl font-bold text-dark-900 md:text-5xl">Organizaciones que <span className="text-primary-600">confían en nosotros</span></h2></Reveal></Container>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
            <motion.div className="flex gap-8" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
              {duplicated.map((partner, i) => (
                <div key={`${partner.id}-${i}`} className="flex w-40 shrink-0 items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-neutral-100 p-4 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                    <span className="text-xs font-medium text-neutral-400">{partner.name.charAt(0)}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </Section>
      )}

      <Section className="bg-dark-900">
        <Container className="text-center">
          <Reveal>
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">¿Quieres ser parte del <span className="text-secondary-400">cambio</span>?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">Hay muchas formas de contribuir a la protección de la Amazonía peruana. Únete a nuestra misión.</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/voluntariado"><Button variant="secondary" size="xl" rightIcon={<ArrowRight size={18} />}>Quiero ser voluntario</Button></Link>
              <Link to="/donaciones"><Button variant="primary" size="xl">Hacer una donación</Button></Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </PageTransition>
  )
}
