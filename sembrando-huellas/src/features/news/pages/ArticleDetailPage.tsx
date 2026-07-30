import { useParams, Link, useNavigate } from 'react-router-dom'
import { Share2, Tag } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Button from '@/components/buttons/Button'
import NewsCard from '@/components/cards/NewsCard'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import { siteConfig } from '@/config/site'
import newsData from '@/data/json/news.json'

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const article = newsData.find(n => n.slug === slug)
  const articles = newsData.filter(n => n.title).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  if (!article) {
    return (
      <PageTransition>
        <Container><Section><div className="py-20 text-center"><h1 className="mb-4 text-4xl font-bold">Artículo no encontrado</h1><Link to="/noticias"><Button variant="primary">Ver todas las noticias</Button></Link></div></Section></Container>
      </PageTransition>
    )
  }

  const related = articles.filter(a => a.id !== article.id).slice(0, 3)
  const articleUrl = `${siteConfig.url}/noticias/${article.slug}`

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Noticias', url: '/noticias' }, { name: article.title, url: `/noticias/${article.slug}` }]} />
      <SEO
        title={article.title}
        description={article.excerpt}
        type="article"
        publishedTime={article.publishedAt}
        tags={article.tags}
        url={articleUrl}
      />

      <PageHero title={article.title} />

      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100" />
            </Reveal>

            <Reveal>
              <p className="mb-4 text-lg font-semibold text-primary-600">{article.excerpt}</p>
            </Reveal>

            <Reveal>
              <div className="prose prose-lg max-w-none text-neutral-600">
                <p>{article.content}</p>
                <p>Este es un contenido de ejemplo. Cuando la noticia real esté disponible, este texto será reemplazado por el contenido completo del artículo, incluyendo imágenes, citas y enlaces relacionados.</p>
                <p>El contenido editable será administrado desde el Panel Administrativo del sitio.</p>
              </div>
            </Reveal>

            {article.tags && article.tags.length > 0 && (
              <Reveal>
                <div className="mt-8 flex flex-wrap items-center gap-2">
                  <Tag size={16} className="text-neutral-400" />
                  {article.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">{tag}</span>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal>
              <div className="mt-8 flex items-center gap-4 border-t border-neutral-200 pt-6">
                <span className="text-sm font-medium text-neutral-500">Compartir:</span>
                {['Facebook', 'Twitter', 'WhatsApp'].map(s => (
                  <button key={s} className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-primary-100 hover:text-primary-600" aria-label={`Compartir en ${s}`}>
                    <Share2 size={16} />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section className="bg-neutral-50">
          <Container>
            <Reveal><h2 className="mb-8 text-3xl font-bold text-dark-900">Noticias <span className="text-primary-600">relacionadas</span></h2></Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r.id} direction="up" delay={i * 0.1}>
                  <NewsCard
                    article={{ title: r.title, slug: r.slug, excerpt: r.excerpt, coverImage: r.coverImage, publishedAt: r.publishedAt, category: r.category, author: r.author }}
                    onClick={() => navigate(`/noticias/${r.slug}`)}
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </PageTransition>
  )
}
