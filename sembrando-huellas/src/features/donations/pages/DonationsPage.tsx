import { useState } from 'react'
import { Shield, TrendingUp, Leaf, ArrowRight, CheckCircle, CreditCard, Building2, Globe, Smartphone } from 'lucide-react'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Button from '@/components/buttons/Button'
import CardBase from '@/components/cards/CardBase'
import Input from '@/components/inputs/Input'
import ExpandableCard from '@/components/cards/ExpandableCard'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import impactData from '@/data/json/impact.json'
import faqData from '@/data/json/faq.json'


const donationAmounts = [25, 50, 100, 250, 500, 1000]
const paymentMethods = [
  { name: 'Stripe', description: 'Próximamente', icon: CreditCard },
  { name: 'Mercado Pago', description: 'Próximamente', icon: Building2 },
  { name: 'PayPal', description: 'Próximamente', icon: Globe },
  { name: 'Yape', description: 'Próximamente', icon: Smartphone },
  { name: 'Plin', description: 'Próximamente', icon: Smartphone },
]

const reasons = [
  { title: 'Impacto directo', description: 'El 85% de tu donación va directamente a programas de conservación.', icon: TrendingUp },
  { title: 'Transparencia total', description: 'Publicamos informes auditados anuales sobre el uso de fondos.', icon: Shield },
  { title: 'Certificación', description: 'Recibes un certificado de donación deducible de impuestos.', icon: CheckCircle },
  { title: 'Cambio real', description: 'Cada árbol plantado gracias a ti es un paso hacia un futuro sostenible.', icon: Leaf },
]

export default function DonationsPage() {
  const [amount, setAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState('')
  const donFaqs = faqData.filter(f => f.category === 'Donaciones' || f.category === 'Transparencia')
  const [openFaq, setOpenFaq] = useState<string | null>(null)


  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Donaciones', url: '/donaciones' }]} />
      <SEO title="Donaciones" description="Apoya la conservación de la Amazonía peruana con tu donación. Tu contribución ayuda a plantar árboles, educar niños y proteger especies." />

      <PageHero
        title="Tu donación transforma"
        subtitle="Cada contribución, sin importar su tamaño, ayuda a proteger la Amazonía peruana y sus especies."
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Reveal><p className="mb-2 text-sm font-semibold tracking-widest text-secondary-600 uppercase">Tu aporte</p><h2 className="mb-6 text-4xl font-bold text-dark-900 md:text-5xl">Elige tu <span className="text-primary-600">contribución</span></h2></Reveal>

              <Reveal>
                <p className="mb-4 text-sm font-semibold text-neutral-700">Selecciona un monto:</p>
                <div className="mb-6 grid grid-cols-3 gap-3">
                  {donationAmounts.map(a => (
                    <button key={a} onClick={() => { setAmount(a); setCustomAmount('') }} className={`rounded-xl border-2 py-4 text-center font-bold text-lg transition-all ${amount === a ? 'border-warm-500 bg-warm-50 text-warm-700' : 'border-neutral-200 text-neutral-600 hover:border-warm-300'}`}>
                      S/{a}
                    </button>
                  ))}
                </div>
                <div className="mb-8">
                  <Input label="Otro monto (S/)" type="number" placeholder="Ingresa un monto personalizado" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setAmount(0)}} />
                </div>
              </Reveal>

              <Reveal>
                <p className="mb-4 text-sm font-semibold text-neutral-700">Método de pago:</p>
                <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {paymentMethods.map(pm => {
                    const Icon = pm.icon
                    return (
                      <div key={pm.name} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center opacity-60">
                        <Icon size={24} className="mx-auto mb-2 text-neutral-400" />
                        <p className="text-xs font-semibold text-neutral-600">{pm.name}</p>
                        <p className="text-xs text-neutral-400">{pm.description}</p>
                      </div>
                    )
                  })}
                </div>
              </Reveal>

              <Button variant="primary" size="xl" fullWidth rightIcon={<ArrowRight size={18} />} disabled>
                Donar S/{(amount || parseInt(customAmount) || 0).toFixed(2)}
              </Button>
              <p className="mt-2 text-center text-xs text-neutral-400">Los pagos en línea estarán disponibles próximamente (Stripe, Mercado Pago, PayPal, Yape, Plin). Mientras tanto, contáctanos para coordinar tu donación.</p>
            </div>

            <div className="space-y-6">
              <Reveal direction="right">
                <CardBase variant="elevated" className="bg-gradient-to-br from-warm-800 to-dark-900 text-white">
                  <h3 className="mb-4 text-2xl font-bold">Con tu ayuda hemos logrado</h3>
                  <div className="space-y-4">
                    {impactData.metrics?.slice(0, 4).map(m => (
                      <div key={m.label} className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-sm text-white/80">{m.label}</span>
                        <span className="text-lg font-bold text-secondary-400">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </CardBase>
              </Reveal>

              {reasons.map((r, i) => {
                const Icon = r.icon
                return (
                  <Reveal key={i} direction="right" delay={i * 0.05}>
                    <CardBase variant="flat" className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warm-100 text-warm-600"><Icon size={24} /></div>
                      <div><h3 className="font-semibold text-dark-800">{r.title}</h3><p className="text-sm text-neutral-600">{r.description}</p></div>
                    </CardBase>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-neutral-50">
        <Container>
          <Reveal><p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">FAQ</p><h2 className="mb-12 text-center text-4xl font-bold text-dark-900 md:text-5xl">Preguntas <span className="text-primary-600">frecuentes</span></h2></Reveal>
          <div className="mx-auto max-w-3xl space-y-4">
            {donFaqs.length > 0 ? donFaqs.map((faq, i) => (
              <Reveal key={faq.id} direction="up" delay={i * 0.05}>
                <ExpandableCard title={faq.question} preview="" expanded={openFaq === faq.id} onToggle={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}>
                  <p className="text-neutral-600">{faq.answer}</p>
                </ExpandableCard>
              </Reveal>
            )) : <p className="text-center text-neutral-500">Próximamente más información.</p>}
          </div>
        </Container>
      </Section>
    </PageTransition>
  )
}
