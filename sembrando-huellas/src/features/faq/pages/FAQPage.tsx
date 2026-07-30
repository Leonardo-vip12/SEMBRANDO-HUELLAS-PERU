import { useState } from 'react'
import { Search } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Input from '@/components/inputs/Input'
import ExpandableCard from '@/components/cards/ExpandableCard'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import faqData from '@/data/json/faq.json'

export default function FAQPage() {
  const faqs = faqData.filter(f => f.question && f.answer)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const categories = [...new Set(faqs.map(f => f.category).filter(Boolean))]

  const filtered = faqs.filter(f => {
    if (search && !f.question.toLowerCase().includes(search.toLowerCase()) && !f.answer.toLowerCase().includes(search.toLowerCase())) return false
    if (category && f.category !== category) return false
    return true
  })

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Preguntas Frecuentes', url: '/faq' }]} />
      <SEO title="Preguntas Frecuentes" description="Encuentra respuestas a las preguntas más frecuentes sobre Sembrando Huellas Perú, sus programas, voluntariado y donaciones." />

      <PageHero
        title="Preguntas Frecuentes"
        subtitle="Resolvemos tus dudas sobre nuestra organización, programas y formas de participar."
      />

      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Input placeholder="Buscar preguntas..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search size={18} />} />
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              <button onClick={() => setCategory('')} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${!category ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>Todas</button>
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${category === c ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{c}</button>
              ))}
            </div>

            <div className="space-y-4">
              {filtered.map((faq, i) => (
                <Reveal key={faq.id} direction="up" delay={i * 0.05}>
                  <ExpandableCard title={faq.question} preview="" expanded={openId === faq.id} onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}>
                    <p className="text-neutral-600">{faq.answer}</p>
                  </ExpandableCard>
                </Reveal>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center"><p className="text-lg text-neutral-500">No se encontraron preguntas con esos criterios.</p></div>
            )}
          </div>
        </Container>
      </Section>
    </PageTransition>
  )
}
