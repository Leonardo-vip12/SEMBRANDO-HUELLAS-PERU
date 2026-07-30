import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Input from '@/components/inputs/Input'
import ProjectCard from '@/components/cards/ProjectCard'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import projectsData from '@/data/json/projects.json'

export default function ProjectsPage() {
  const navigate = useNavigate()
  const projects = projectsData.filter(p => p.title)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = projects.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter && p.status !== statusFilter) return false
    return true
  })

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Proyectos', url: '/proyectos' }]} />
      <SEO title="Proyectos" description="Conoce nuestros proyectos de conservación, educación y reforestación en la Amazonía peruana." />

      <PageHero
        title="Nuestros Proyectos"
        subtitle="Iniciativas de conservación, reforestación y educación que están transformando la Amazonía peruana."
      />

      <Section>
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input placeholder="Buscar proyectos..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search size={18} />} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStatusFilter('')} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${!statusFilter ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>Todos</button>
              {['active', 'completed'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                  {s === 'active' ? 'Activos' : 'Completados'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <Reveal key={project.id} direction="up" delay={i * 0.1}>
                <ProjectCard
                  project={{
                    title: project.title,
                    slug: project.slug,
                    description: project.description,
                    category: project.category,
                    coverImage: project.coverImage,
                    status: project.status as 'active' | 'completed' | 'pending' | 'on-hold',
                  }}
                  onClick={() => navigate(`/proyectos/${project.slug}`)}
                />
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center"><p className="text-lg text-neutral-500">No se encontraron proyectos con esos criterios.</p></div>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
