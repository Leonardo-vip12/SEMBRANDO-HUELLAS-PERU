import { useParams, Link } from 'react-router-dom'
import { MapPin, Target, Calendar, Users, ArrowRight, TreePine, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Button from '@/components/buttons/Button'
import CardBase from '@/components/cards/CardBase'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import projectsData from '@/data/json/projects.json'
import partnersData from '@/data/json/partners.json'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const project = projectsData.find(p => p.slug === slug)

  if (!project) {
    return (
      <PageTransition>
        <Container><Section><div className="py-20 text-center"><h1 className="mb-4 text-4xl font-bold">Proyecto no encontrado</h1><Link to="/proyectos"><Button variant="primary">Ver todos los proyectos</Button></Link></div></Section></Container>
      </PageTransition>
    )
  }

  const projectPartners = partnersData.filter(p => project.partners?.includes(p.name))

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Proyectos', url: '/proyectos' }, { name: project.title, url: `/proyectos/${project.slug}` }]} />
      <SEO title={project.title} description={project.description} />

      <PageHero
        title={project.title}
        subtitle={project.location}
      />

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <Reveal>
                <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100">
                  <div className="flex h-full w-full items-center justify-center"><TreePine size={80} className="text-primary-300" /></div>
                </div>
              </Reveal>

              <Reveal>
                <h2 className="mb-4 text-2xl font-bold text-dark-900">Descripción</h2>
                <p className="leading-relaxed text-neutral-600">{project.longDescription}</p>
              </Reveal>

              {project.goals && project.goals.length > 0 && (
                <Reveal>
                  <h2 className="mb-4 text-2xl font-bold text-dark-900 flex items-center gap-2"><Target size={24} className="text-primary-600" /> Objetivos</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {project.goals.map((goal, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                        <CheckCircle size={20} className="mt-0.5 shrink-0 text-primary-500" />
                        <span className="text-sm text-neutral-700">{goal}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {project.achievements && project.achievements.length > 0 && (
                <Reveal>
                  <h2 className="mb-4 text-2xl font-bold text-dark-900">Resultados</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {project.achievements.map((ach, i) => (
                      <CardBase key={i} variant="flat" className="flex items-center gap-3">
                        <CheckCircle size={20} className="shrink-0 text-secondary-500" />
                        <span className="text-sm text-neutral-700">{ach}</span>
                      </CardBase>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            <div className="space-y-4">
              <CardBase variant="default">
                <h3 className="mb-4 text-lg font-bold text-dark-800">Información del proyecto</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-primary-600" /><div><p className="font-semibold text-dark-700">Ubicación</p><p className="text-neutral-600">{project.location}</p></div></div>
                  <div className="flex items-start gap-3"><Calendar size={16} className="mt-0.5 shrink-0 text-primary-600" /><div><p className="font-semibold text-dark-700">Inicio</p><p className="text-neutral-600">{format(new Date(project.startDate), "d 'de' MMMM, yyyy", { locale: es })}</p></div></div>
                  {project.endDate && <div className="flex items-start gap-3"><Calendar size={16} className="mt-0.5 shrink-0 text-primary-600" /><div><p className="font-semibold text-dark-700">Fin estimado</p><p className="text-neutral-600">{format(new Date(project.endDate), "d 'de' MMMM, yyyy", { locale: es })}</p></div></div>}
                  <div className="flex items-start gap-3"><Users size={16} className="mt-0.5 shrink-0 text-primary-600" /><div><p className="font-semibold text-dark-700">Categoría</p><p className="text-neutral-600">{project.category}</p></div></div>
                </div>
              </CardBase>

              {projectPartners.length > 0 && (
                <CardBase variant="default">
                  <h3 className="mb-3 text-lg font-bold text-dark-800">Aliados</h3>
                  <div className="space-y-2 text-sm text-neutral-600">
                    {projectPartners.map(p => <p key={p.id}>{p.name}</p>)}
                  </div>
                </CardBase>
              )}

              <Link to="/voluntariado"><Button variant="primary" className="w-full" rightIcon={<ArrowRight size={16} />}>Participar en este proyecto</Button></Link>
            </div>
          </div>
        </Container>
      </Section>
    </PageTransition>
  )
}
