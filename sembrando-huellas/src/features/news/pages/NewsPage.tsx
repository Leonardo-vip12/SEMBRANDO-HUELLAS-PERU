import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Input from '@/components/inputs/Input'
import NewsCard from '@/components/cards/NewsCard'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import newsData from '@/data/json/news.json'

export default function NewsPage() {
  const navigate = useNavigate()
  const articles = newsData.filter(n => n.title).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))]

  const filtered = articles.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.excerpt.toLowerCase().includes(search.toLowerCase())) return false
    if (category && a.category !== category) return false
    return true
  })

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Noticias', url: '/noticias' }]} />
      <SEO title="Noticias" description="Últimas noticias y novedades sobre conservación, reforestación y educación ambiental en la Amazonía peruana." />

      <PageHero
        title="Nuestras Novedades"
        subtitle="Mantente informado sobre nuestras actividades, logros y eventos."
      />

      <Section>
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input placeholder="Buscar noticias..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search size={18} />} />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCategory('')} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${!category ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>Todas</button>
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${category === c ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article, i) => (
              <Reveal key={article.id} direction="up" delay={i * 0.1}>
                <NewsCard
                  article={{
                    title: article.title,
                    slug: article.slug,
                    excerpt: article.excerpt,
                    coverImage: article.coverImage,
                    publishedAt: article.publishedAt,
                    category: article.category,
                    author: article.author,
                  }}
                  onClick={() => navigate(`/noticias/${article.slug}`)}
                />
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center"><p className="text-lg text-neutral-500">No se encontraron noticias.</p></div>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
