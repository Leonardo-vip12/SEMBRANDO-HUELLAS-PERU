import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, BookOpen, TreePine, Megaphone, Sprout, Users } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Button from '@/components/buttons/Button'
import CardBase from '@/components/cards/CardBase'
import Input from '@/components/inputs/Input'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import programsData from '@/data/json/programs.json'

const iconMap: Record<string, React.ElementType> = { BookOpen, TreePine, Megaphone, Sprout, Users }

function resolveIcon(name: string): React.ElementType {
  return iconMap[name] || BookOpen
}

export default function ProgramsPage() {
  const programs = programsData.filter(p => p.title)
  const [search, setSearch] = useState('')

  const filtered = programs.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Programas', url: '/programas' }]} />
      <SEO title="Programas" description="Conoce nuestros programas de conservación, educación ambiental y reforestación en la Amazonía peruana." />

      <PageHero
        title="Nuestros Programas"
        subtitle="Cinco líneas de acción estratégicas para proteger la Amazonía peruana."
      />

      <Section>
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input placeholder="Buscar programas..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search size={18} />} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => {
              const Icon = resolveIcon(p.icon)
              return (
                <Reveal key={p.id} direction="up" delay={i * 0.1}>
                  <CardBase variant="default" hover className="group flex h-full flex-col">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-all group-hover:bg-primary-600 group-hover:text-white">
                      <Icon size={28} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-dark-800">{p.title}</h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600">{p.description}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">{p.targetAudience?.split(',').slice(0, 2).join(', ')}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                        {p.status === 'active' ? 'Activo' : p.status}
                      </span>
                    </div>
                    <Link to={`/programas/${p.slug}`}>
                      <Button variant="link" className="inline-flex items-center gap-1 text-sm">Conocer más <ArrowRight size={14} /></Button>
                    </Link>
                  </CardBase>
                </Reveal>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-neutral-500">No se encontraron programas con ese criterio de búsqueda.</p>
            </div>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
