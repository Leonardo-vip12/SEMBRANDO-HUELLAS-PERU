import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Input from '@/components/inputs/Input'
import SpeciesCard from '@/components/cards/SpeciesCard'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import speciesData from '@/data/json/species.json'

export default function SpeciesPage() {
  const navigate = useNavigate()
  const species = speciesData.filter(s => s.name && s.scientificName)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const categories = [...new Set(species.map(s => s.category).filter(Boolean))]

  const filtered = species.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.scientificName.toLowerCase().includes(search.toLowerCase())) return false
    if (category && s.category !== category) return false
    return true
  })

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Especies Amazónicas', url: '/especies' }]} />
      <SEO title="Especies Amazónicas" description="Explora la biodiversidad de la Amazonía peruana: mamíferos, aves, reptiles y plantas en peligro de extinción." />

      <PageHero
        title="Especies Amazónicas"
        subtitle="Conoce las especies emblemáticas que protegemos en nuestros proyectos de conservación."
      />

      <Section>
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input placeholder="Buscar especies..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search size={18} />} />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCategory('')} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${!category ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>Todas</button>
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${category === c ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((s, i) => (
              <Reveal key={s.id} direction="up" delay={i * 0.1}>
                <SpeciesCard
                  species={{
                    name: s.name,
                    scientificName: s.scientificName,
                    conservationStatus: s.conservationStatus as 'safe' | 'vulnerable' | 'endangered' | 'critical',
                    habitat: s.habitat,
                    image: s.image,
                    slug: s.slug,
                  }}
                  onClick={() => navigate(`/especies/${s.slug}`)}
                />
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center"><p className="text-lg text-neutral-500">No se encontraron especies con esos criterios.</p></div>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
