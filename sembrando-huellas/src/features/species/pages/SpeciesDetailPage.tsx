import { useParams, Link } from 'react-router-dom'
import { AlertTriangle, Heart, ArrowRight } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Button from '@/components/buttons/Button'
import CardBase from '@/components/cards/CardBase'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import speciesData from '@/data/json/species.json'

export default function SpeciesDetailPage() {
  const { slug } = useParams()
  const species = speciesData.find(s => s.slug === slug)

  if (!species) {
    return (
      <PageTransition>
        <Container><Section><div className="py-20 text-center"><h1 className="mb-4 text-4xl font-bold">Especie no encontrada</h1><Link to="/especies"><Button variant="primary">Ver todas las especies</Button></Link></div></Section></Container>
      </PageTransition>
    )
  }

  const chars = species.characteristics || {}

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Especies', url: '/especies' }, { name: species.name, url: `/especies/${species.slug}` }]} />
      <SEO title={species.name} description={`${species.name} (${species.scientificName}) — ${species.description}`} />

      <PageHero
        title={species.name}
        subtitle={species.scientificName}
      />

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal direction="left">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100">
                <div className="flex h-full w-full items-center justify-center"><Heart size={80} className="text-primary-300" /></div>
              </div>
            </Reveal>

            <div>
              <Reveal direction="right">
                <h2 className="mb-6 text-3xl font-bold text-dark-900">Acerca de la especie</h2>
                <p className="mb-8 text-lg leading-relaxed text-neutral-600">{species.description}</p>
              </Reveal>

              <Reveal direction="up" delay={0.2}>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(chars).map(([key, val]) => (
                    <CardBase key={key} variant="flat" padding="sm">
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">{key}</p>
                      <p className="text-sm font-semibold text-dark-800">{val as string}</p>
                    </CardBase>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {species.threats && species.threats.length > 0 && (
        <Section className="bg-neutral-50">
          <Container>
            <Reveal>
              <h2 className="mb-8 text-3xl font-bold text-dark-900 flex items-center gap-3"><AlertTriangle size={28} className="text-coral-500" /> Amenazas</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {species.threats.map((t, i) => (
                  <CardBase key={i} variant="default" className="border-l-4 border-l-coral-400">
                    <p className="font-semibold text-dark-800">{t}</p>
                  </CardBase>
                ))}
              </div>
            </Reveal>
          </Container>
        </Section>
      )}

      {species.conservationActions && species.conservationActions.length > 0 && (
        <Section>
          <Container>
            <Reveal>
              <h2 className="mb-8 text-3xl font-bold text-dark-900 flex items-center gap-3"><Heart size={28} className="text-primary-600" /> Acciones de conservación</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {species.conservationActions.map((a, i) => (
                  <CardBase key={i} variant="elevated" className="border-l-4 border-l-primary-500">
                    <p className="font-semibold text-dark-800">{a}</p>
                  </CardBase>
                ))}
              </div>
            </Reveal>
          </Container>
        </Section>
      )}

      <Section className="bg-dark-900">
        <Container className="text-center">
          <Reveal>
            <h2 className="mb-4 text-3xl font-bold text-white">Ayúdanos a proteger {species.name}</h2>
            <p className="mx-auto mb-8 max-w-2xl text-white/80">Tu apoyo es fundamental para continuar con nuestras acciones de conservación de la biodiversidad amazónica.</p>
            <Link to="/donaciones"><Button variant="secondary" size="xl" rightIcon={<ArrowRight size={18} />}>Apoyar la conservación</Button></Link>
          </Reveal>
        </Container>
      </Section>
    </PageTransition>
  )
}
