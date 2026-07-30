import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Download, BookOpen, Video, FileText, Image, Newspaper, Heart, Map, Presentation, ArrowRight } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Button from '@/components/buttons/Button'
import CardBase from '@/components/cards/CardBase'
import ExpandableCard from '@/components/cards/ExpandableCard'
import Input from '@/components/inputs/Input'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import downloadsData from '@/data/json/downloads.json'
import faqData from '@/data/json/faq.json'

const iconMap: Record<string, React.ElementType> = { FileText, Image, Video, Newspaper, Heart, Map, Presentation, BookOpen, Download }

function resolveIcon(name: string): React.ElementType {
  return iconMap[name] || FileText
}

const resourceCategories = [
  { title: 'Guías Pedagógicas', description: 'Materiales completos para docentes sobre educación ambiental en la Amazonía.', icon: BookOpen, color: 'bg-info-100 text-info-600' },
  { title: 'Infografías', description: 'Recursos visuales sobre biodiversidad, cambio climático y conservación.', icon: Image, color: 'bg-green-100 text-green-600' },
  { title: 'Videos Educativos', description: 'Contenido audiovisual para aprender sobre la Amazonía peruana.', icon: Video, color: 'bg-purple-100 text-purple-600' },
  { title: 'Campañas', description: 'Material de campañas de sensibilización ambiental listo para compartir.', icon: Newspaper, color: 'bg-coral-100 text-coral-600' },
  { title: 'Biblioteca Digital', description: 'Colección de publicaciones, informes y estudios sobre la Amazonía.', icon: BookOpen, color: 'bg-gold-100 text-gold-600' },
]

const bannerCampaigns = [
  { title: 'Yo cuido la Amazonía', description: 'Campaña de sensibilización sobre la importancia de la Amazonía peruana para el mundo.', image: '/images/campaigns/amazonia.svg' },
  { title: 'Planta esperanza', description: 'Campaña de reforestación participativa que invita a la ciudadanía a plantar árboles nativos.', image: '/images/campaigns/planta.svg' },
]

export default function EducationPage() {
  const downloads = downloadsData.filter(d => d.title)
  const [search, setSearch] = useState('')
  const eduFaqs = faqData.filter(f => f.category === 'Educación')
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const filteredDownloads = downloads.filter(d => !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase()))

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Educación Ambiental', url: '/educacion' }]} />
      <SEO title="Educación Ambiental" description="Recursos educativos, guías, infografías y materiales didácticos sobre conservación de la Amazonía peruana." />

      <PageHero
        title="Aprende para proteger"
        subtitle="Recursos educativos, guías y materiales para formar conciencia ambiental en la Amazonía peruana."
      />

      <Section>
        <Container>
          <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">Recursos</p><h2 className="mb-12 text-center text-4xl font-bold text-dark-900 md:text-5xl">Categorías de <span className="text-primary-600">recursos</span></h2></Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resourceCategories.map((rc, i) => {
              const Icon = rc.icon
              return (
                <Reveal key={i} direction="up" delay={i * 0.1}>
                  <CardBase variant="default" hover className="group h-full">
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${rc.color} transition-all`}><Icon size={28} /></div>
                    <h3 className="mb-3 text-lg font-bold text-dark-800">{rc.title}</h3>
                    <p className="text-sm text-neutral-600">{rc.description}</p>
                  </CardBase>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-neutral-50">
        <Container>
          <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">Biblioteca</p><h2 className="mb-4 text-center text-4xl font-bold text-dark-900 md:text-5xl">Material <span className="text-primary-600">descargable</span></h2><p className="mx-auto mb-8 max-w-2xl text-center text-lg text-neutral-600">Recursos educativos gratuitos para descargar y compartir.</p></Reveal>

          <div className="mb-8 max-w-md">
            <Input placeholder="Buscar recursos..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search size={18} />} />
          </div>

          <div className="grid gap-4">
            {filteredDownloads.map((d, i) => {
              const Icon = resolveIcon(d.icon)
              return (
                <Reveal key={d.id} direction="up" delay={i * 0.05}>
                  <CardBase variant="flat" className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600"><Icon size={24} /></div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-dark-800">{d.title}</h3>
                      <p className="text-sm text-neutral-600">{d.description}</p>
                      <div className="mt-1 flex gap-3 text-xs text-neutral-400"><span>{d.format}</span><span>{d.fileSize}</span><span>{d.downloads} descargas</span></div>
                    </div>
                    <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>Descargar</Button>
                  </CardBase>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-dark-900">
        <Container>
          <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-400 uppercase">Campañas</p><h2 className="mb-12 text-center text-4xl font-bold text-white md:text-5xl">Banners y <span className="text-secondary-400">campañas</span></h2></Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {bannerCampaigns.map((c, i) => (
              <Reveal key={i} direction="up" delay={i * 0.1}>
                <CardBase variant="default" hover className="group overflow-hidden border-primary-800/30 bg-white/5">
                  <div className="mb-4 aspect-[16/9] overflow-hidden rounded-lg bg-gradient-to-br from-primary-800 to-dark-800" />
                  <h3 className="mb-2 text-xl font-bold text-white">{c.title}</h3>
                  <p className="text-sm text-white/80">{c.description}</p>
                </CardBase>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">FAQ</p><h2 className="mb-12 text-center text-4xl font-bold text-dark-900 md:text-5xl">Preguntas <span className="text-primary-600">frecuentes</span></h2></Reveal>
          <div className="mx-auto max-w-3xl space-y-4">
            {eduFaqs.length > 0 ? eduFaqs.map((faq, i) => (
              <Reveal key={faq.id} direction="up" delay={i * 0.05}>
                <ExpandableCard title={faq.question} preview="" expanded={openFaq === faq.id} onToggle={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}>
                  <p className="text-neutral-600">{faq.answer}</p>
                </ExpandableCard>
              </Reveal>
            )) : (
              <p className="text-center text-neutral-500">Próximamente más preguntas frecuentes sobre educación ambiental.</p>
            )}
          </div>
        </Container>
      </Section>

      <Section className="bg-info-600">
        <Container className="text-center">
          <Reveal>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">¿Eres docente o institución educativa?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-white/80">Contáctanos para coordinar talleres, charlas y programas de educación ambiental en tu institución.</p>
            <Link to="/contacto"><Button variant="secondary" size="xl" rightIcon={<ArrowRight size={18} />}>Solicitar información</Button></Link>
          </Reveal>
        </Container>
      </Section>
    </PageTransition>
  )
}
