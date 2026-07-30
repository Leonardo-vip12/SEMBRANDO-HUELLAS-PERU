import { useParams, Link } from 'react-router-dom'
import { ArrowRight, Calendar, Target, List } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Button from '@/components/buttons/Button'
import CardBase from '@/components/cards/CardBase'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import programsData from '@/data/json/programs.json'

export default function ProgramDetailPage() {
  const { slug } = useParams()
  const program = programsData.find(p => p.slug === slug)

  if (!program) {
    return (
      <PageTransition>
        <Container><Section><div className="py-20 text-center"><h1 className="mb-4 text-4xl font-bold">Programa no encontrado</h1><Link to="/programas"><Button variant="primary">Ver todos los programas</Button></Link></div></Section></Container>
      </PageTransition>
    )
  }


  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Programas', url: '/programas' }, { name: program.title, url: `/programas/${program.slug}` }]} />
      <SEO title={program.title} description={program.description} />

      <PageHero
        title={program.title}
        subtitle={program.description}
      />

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Reveal>
                <h2 className="mb-6 text-3xl font-bold text-dark-900">Acerca del programa</h2>
                <p className="mb-8 text-lg leading-relaxed text-neutral-600">{program.longDescription}</p>
              </Reveal>

              <Reveal>
                <h3 className="mb-4 text-xl font-bold text-dark-800 flex items-center gap-2"><Target size={22} className="text-primary-600" /> Objetivos</h3>
                <ul className="mb-8 space-y-3">
                  {program.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 text-neutral-600"><span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-primary-500" />{obj}</li>
                  ))}
                </ul>
              </Reveal>

              <Reveal>
                <h3 className="mb-4 text-xl font-bold text-dark-800 flex items-center gap-2"><List size={22} className="text-primary-600" /> Actividades</h3>
                <ul className="mb-8 space-y-3">
                  {program.activities.map((act, i) => (
                    <li key={i} className="flex items-start gap-3 text-neutral-600"><span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-secondary-500" />{act}</li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div>
              <div className="space-y-4">
                <CardBase variant="default">
                  <h4 className="mb-3 text-lg font-bold text-dark-800 flex items-center gap-2"><Calendar size={18} className="text-primary-600" /> Información</h4>
                  <div className="space-y-3 text-sm">
                    <div><span className="font-semibold text-dark-700">Duración:</span> <span className="text-neutral-600">{program.duration}</span></div>
                    <div><span className="font-semibold text-dark-700">Horario:</span> <span className="text-neutral-600">{program.schedule}</span></div>
                    <div><span className="font-semibold text-dark-700">Audiencia:</span> <span className="text-neutral-600">{program.targetAudience}</span></div>
                    <div><span className="font-semibold text-dark-700">Estado:</span> <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${program.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>{program.status === 'active' ? 'Activo' : program.status}</span></div>
                  </div>
                </CardBase>

                {program.requirements.length > 0 && (
                  <CardBase variant="default">
                    <h4 className="mb-3 text-lg font-bold text-dark-800">Requisitos</h4>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      {program.requirements.map((req, i) => <li key={i} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />{req}</li>)}
                    </ul>
                  </CardBase>
                )}
              </div>
            </div>
          </div>

          <Reveal>
            <div className="mt-12 text-center">
              <Link to="/voluntariado"><Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>Participa en este programa</Button></Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </PageTransition>
  )
}
