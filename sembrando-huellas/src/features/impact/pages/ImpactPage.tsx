import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
import { School, GraduationCap, CalendarCheck, TreePine, Heart, Globe, Users, Target } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import CardBase from '@/components/cards/CardBase'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import impactData from '@/data/json/impact.json'

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = Math.ceil(value / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, value])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const summaryIcons: Record<string, React.ElementType> = {
  treesPlanted: TreePine,
  hectaresRestored: Globe,
  speciesProtected: Heart,
  volunteers: Users,
  communitiesServed: Target,
}

const summaryLabels: Record<string, string> = {
  treesPlanted: 'Árboles Plantados',
  hectaresRestored: 'Hectáreas Restauradas',
  speciesProtected: 'Especies Protegidas',
  volunteers: 'Voluntarios',
  communitiesServed: 'Comunidades Atendidas',
}

export default function ImpactPage() {
  const metrics = impactData.metrics || []
  const timeline = (impactData.timeline || []).filter(t => t.year)
  const summary = impactData.summary || {}
  const summaryEntries = Object.entries(summary).filter(([_, v]) => v !== null && v !== undefined)

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Impacto', url: '/impacto' }]} />
      <SEO title="Impacto" description="Conoce el impacto de Sembrando Huellas Perú en la conservación de la Amazonía: árboles plantados, estudiantes formados y más." />

      <PageHero
        title="Nuestro Impacto"
        subtitle="Resultados medibles que demuestran nuestro compromiso con la conservación de la Amazonía."
      />

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, i) => {
              const Icon = (() => { const map: Record<string, React.ElementType> = { School, GraduationCap, CalendarCheck, TreePine }; return map[m.icon] || TreePine })()
              const numValue = parseInt(m.value.replace(/[^0-9]/g, ''))
              const suffixPart = m.value.replace(/[0-9]/g, '')
              return (
                <Reveal key={i} direction="up" delay={i * 0.1}>
                  <CardBase variant="elevated" className="group text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-all group-hover:bg-primary-600 group-hover:text-white"><Icon size={32} /></div>
                    <p className="mb-1 text-4xl font-bold text-dark-900"><AnimatedCounter value={numValue} />{suffixPart}</p>
                    <p className="mb-1 text-sm font-semibold text-neutral-700">{m.label}</p>
                    <p className="text-xs text-neutral-500">{m.description}</p>
                  </CardBase>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </Section>

      {summaryEntries.length > 0 && (
        <Section className="bg-neutral-50">
          <Container>
            <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">Resumen</p><h2 className="mb-12 text-center text-4xl font-bold text-dark-900 md:text-5xl">Datos <span className="text-primary-600">clave</span></h2></Reveal>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {summaryEntries.map(([key, value]) => {
                const Icon = summaryIcons[key] || TreePine
                return (
                  <Reveal key={key} direction="up" delay={0.1}>
                    <CardBase variant="default" className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600"><Icon size={28} /></div>
                      <div>
                        <p className="text-2xl font-bold text-dark-900"><AnimatedCounter value={value as number} /></p>
                        <p className="text-sm text-neutral-600">{summaryLabels[key] || key}</p>
                      </div>
                    </CardBase>
                  </Reveal>
                )
              })}
            </div>
          </Container>
        </Section>
      )}

      {timeline.length > 0 && (
        <Section>
          <Container>
            <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">Trayectoria</p><h2 className="mb-12 text-center text-4xl font-bold text-dark-900 md:text-5xl">Línea de <span className="text-primary-600">tiempo</span></h2></Reveal>
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-primary-200 md:left-1/2 md:-translate-x-px" />
              {timeline.map((item, i) => (
                <div key={i} className={`relative mb-8 flex flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <Reveal direction={i % 2 === 0 ? 'left' : 'right'}>
                      <CardBase variant="flat" className="inline-block"><p className="mb-1 text-2xl font-bold text-primary-600">{item.year}</p><h3 className="mb-1 text-lg font-bold text-dark-800">{item.title}</h3><p className="text-sm text-neutral-600">{item.description}</p></CardBase>
                    </Reveal>
                  </div>
                  <div className="relative flex items-center justify-center"><div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-primary-200 bg-white"><div className="h-3 w-3 rounded-full bg-primary-600" /></div></div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </PageTransition>
  )
}
