import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  ChevronDown, Heart, Eye, Lightbulb, Users, Leaf, School, GraduationCap,
  CalendarCheck, TreePine, Sprout, BookOpen, Megaphone, ArrowRight,
  Quote, MapPin, Mail, Phone, Send
} from 'lucide-react'
import { SEO } from '@/components/seo'
import { OrganizationSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import Button from '@/components/buttons/Button'
import CardBase from '@/components/cards/CardBase'
import ProjectCard from '@/components/cards/ProjectCard'
import SpeciesCard from '@/components/cards/SpeciesCard'
import GalleryCard from '@/components/cards/GalleryCard'
import NewsCard from '@/components/cards/NewsCard'
import ExpandableCard from '@/components/cards/ExpandableCard'
import { FadeIn } from '@/components/animations/FadeIn'
import { Reveal } from '@/components/animations/Reveal'
import Lightbox from '@/components/visual/Lightbox'
import SwiperSlider from '@/components/visual/SwiperSlider'
import Image from '@/components/visual/Image'
import Input from '@/components/inputs/Input'
import Textarea from '@/components/inputs/Textarea'
import organizationData from '@/data/json/organization.json'
import impactData from '@/data/json/impact.json'
import programsData from '@/data/json/programs.json'
import projectsData from '@/data/json/projects.json'
import speciesData from '@/data/json/species.json'
import galleryData from '@/data/json/gallery.json'
import testimonialsData from '@/data/json/testimonials.json'
import partnersData from '@/data/json/partners.json'
import newsData from '@/data/json/news.json'
import faqData from '@/data/json/faq.json'

const iconMap: Record<string, React.ElementType> = {
  Heart, Eye, Lightbulb, Users, Leaf, School, GraduationCap,
  CalendarCheck, TreePine, Sprout, BookOpen, Megaphone
}

function resolveIcon(name: string): React.ElementType {
  return iconMap[name] || Leaf
}

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const numValue = parseInt(value.replace(/[^0-9]/g, ''))
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = Math.ceil(numValue / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= numValue) {
        setCount(numValue)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, numValue])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-xs font-medium tracking-widest text-white/60 uppercase">Descubre</span>
        <ChevronDown className="h-5 w-5 text-white/40" />
      </motion.div>
    </motion.div>
  )
}

const HERO_BG = '/images/hero-bg.jpg'

function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={HERO_BG}
          alt="Amazonía peruana"
          className="h-full w-full"
          lazy={false}
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-primary-900 via-primary-800 to-dark-900">
              <div className="text-center text-white/20">
                <TreePine size={64} className="mx-auto mb-4" />
                <p className="text-lg">Imagen de la Amazonía</p>
              </div>
            </div>
          }
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/70 via-dark-900/60 to-dark-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <FadeIn delay={0.3}>
          <motion.p
            className="mb-6 text-sm font-semibold tracking-[0.3em] text-secondary-300 uppercase"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Sembrando Huellas Perú
          </motion.p>
        </FadeIn>

        <FadeIn delay={0.5}>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl">
            Cultivando conciencia
            <br />
            <span className="bg-gradient-to-r from-secondary-300 to-accent-300 bg-clip-text text-transparent">
              para proteger el corazón verde del planeta
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.7}>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70 md:text-xl">
            Somos una organización peruana dedicada a la conservación de la Amazonía,
            la reforestación participativa y la formación de una ciudadanía ambientalmente responsable.
          </p>
        </FadeIn>

        <FadeIn delay={0.9}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/nosotros">
              <Button variant="primary" size="xl" rightIcon={<ArrowRight size={18} />}>
                Conoce nuestro trabajo
              </Button>
            </Link>
            <Link to="/voluntariado">
              <Button variant="glass" size="xl">
                Únete como voluntario
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>

      <ScrollIndicator />
    </section>
  )
}

function AboutSection() {
  const values = organizationData.values || []

  return (
    <Section id="nosotros" className="relative overflow-hidden bg-neutral-50">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="left">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src="/images/about.jpg"
                  alt="Equipo de Sembrando Huellas Perú"
                  className="h-full w-full"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
                      <TreePine size={64} className="text-primary-300" />
                    </div>
                  }
                />
              </div>
              <div className="absolute -bottom-6 -right-6 rounded-2xl bg-white p-6 shadow-xl">
                <p className="text-3xl font-bold text-primary-600">{organizationData.foundingYear}</p>
                <p className="text-sm text-neutral-600">Años de impacto</p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal direction="right">
              <p className="mb-2 text-sm font-semibold tracking-widest text-secondary-600 uppercase">
                Quiénes Somos
              </p>
              <h2 className="mb-6 text-4xl font-bold text-dark-900 md:text-5xl">
                Protegiendo la{' '}
                <span className="text-primary-600">Amazonía</span> desde el corazón del Perú
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-neutral-600">
                {organizationData.description}
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {values.slice(0, 4).map((value, i) => {
                  const Icon = resolveIcon(value.icon || 'Leaf')
                  return (
                    <CardBase key={i} variant="flat" padding="sm" className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-dark-800">{value.title}</h4>
                        <p className="text-xs text-neutral-500">{value.description}</p>
                      </div>
                    </CardBase>
                  )
                })}
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.3}>
              <div className="mt-8">
                <Link to="/nosotros">
                  <Button variant="outline" size="lg" rightIcon={<ArrowRight size={18} />}>
                    Conoce nuestra historia
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}

function MissionSection() {
  const missions = [
    { title: 'Educación Ambiental', description: 'Formamos conciencia ecológica en escuelas y comunidades de toda la Amazonía peruana.', icon: BookOpen },
    { title: 'Conservación', description: 'Protegemos bosques y biodiversidad mediante monitoreo comunitario y corredores biológicos.', icon: TreePine },
    { title: 'Sensibilización', description: 'Campañas de comunicación que movilizan a la sociedad en defensa de la naturaleza.', icon: Megaphone },
    { title: 'Reforestación', description: 'Plantamos árboles nativos con voluntarios para recuperar ecosistemas degradados.', icon: Sprout },
    { title: 'Participación Ciudadana', description: 'Empoderamos a comunidades para liderar la conservación de su entorno.', icon: Users },
  ]

  return (
    <Section id="mision" className="relative overflow-hidden bg-gradient-to-b from-primary-900 via-dark-900 to-dark-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-800/20 via-transparent to-transparent" />

      <Container className="relative z-10">
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-400 uppercase">
            Nuestra Misión
          </p>
          <h2 className="mb-4 text-center text-4xl font-bold text-white md:text-5xl">
            Lo que nos impulsa
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-white/60">
            {organizationData.mission}
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {missions.map((m, i) => (
            <Reveal key={i} direction="up" delay={i * 0.1}>
              <CardBase
                variant="default"
                hover
                className="group border-primary-800/30 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary-500/10"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-800/50 text-secondary-400 transition-all duration-500 group-hover:bg-primary-600 group-hover:text-white">
                  <m.icon size={28} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{m.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{m.description}</p>
              </CardBase>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function ImpactSection() {
  const metrics = impactData.metrics || []

  return (
    <Section id="impacto" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-white to-neutral-50" />

      <Container className="relative z-10">
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">
            Nuestro Impacto
          </p>
          <h2 className="mb-4 text-center text-4xl font-bold text-dark-900 md:text-5xl">
            Resultados que{' '}
            <span className="text-primary-600">transforman</span>
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => {
            const Icon = resolveIcon(m.icon)
            const suffixPart = m.value.replace(/[0-9]/g, '')

            return (
              <Reveal key={i} direction="up" delay={i * 0.1}>
                <CardBase variant="elevated" className="group text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white">
                    <Icon size={32} />
                  </div>
                  <p className="mb-1 text-4xl font-bold text-dark-900">
                    <AnimatedCounter value={m.value} />
                    {suffixPart}
                  </p>
                  <p className="mb-1 text-sm font-semibold text-neutral-700">{m.label}</p>
                  <p className="text-xs text-neutral-500">{m.description}</p>
                </CardBase>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

function ProgramsSection() {
  const programs = programsData.filter(p => p.title)

  if (programs.length === 0) {
    return null
  }

  return (
    <Section id="programas" className="bg-neutral-50">
      <Container>
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">
            Programas
          </p>
          <h2 className="mb-4 text-center text-4xl font-bold text-dark-900 md:text-5xl">
            Nuestras líneas de acción
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-neutral-600">
            Cinco programas estratégicos que trabajan de manera integrada para proteger la Amazonía peruana.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, i) => {
            const Icon = resolveIcon(p.icon)
            return (
              <Reveal key={p.id} direction="up" delay={i * 0.1}>
                <CardBase variant="default" hover className="group h-full">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white">
                    <Icon size={28} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-dark-800">{p.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-neutral-600">{p.description}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {p.objectives.slice(0, 2).map((obj, j) => (
                      <span key={j} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                        {obj}
                      </span>
                    ))}
                  </div>
                  <Link to={`/programas/${p.slug}`}>
                    <Button variant="link" className="group inline-flex items-center gap-1 text-sm">
                      Conocer más <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardBase>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

function ProjectsSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const projects = projectsData.filter(p => p.title)

  if (projects.length === 0) return null

  return (
    <Section id="proyectos">
      <Container>
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">
            Proyectos Destacados
          </p>
          <h2 className="mb-4 text-center text-4xl font-bold text-dark-900 md:text-5xl">
            Iniciativas que{' '}
            <span className="text-primary-600">generan cambio</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-neutral-600">
            Conoce nuestros proyectos emblemáticos en conservación, educación y reforestación.
          </p>
        </Reveal>

        <div className="-mx-4">
          <SwiperSlider
            slidesPerView={1}
            spaceBetween={24}
            navigation
            pagination
            loop
            autoplay
            className="px-4 pb-12"
            swiperOptions={{
              breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              },
            }}
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={{
                  title: project.title,
                  slug: project.slug,
                  description: project.description,
                  category: project.category,
                  coverImage: project.coverImage,
                  status: project.status as 'active' | 'completed' | 'pending' | 'on-hold',
                }}
                onClick={() => onNavigate(`/proyectos/${project.slug}`)}
              />
            ))}
          </SwiperSlider>
        </div>

        <Reveal>
          <div className="mt-8 text-center">
            <Link to="/proyectos">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight size={18} />}>
                Ver todos los proyectos
              </Button>
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

function SpeciesSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const species = speciesData.filter(s => s.name && s.scientificName)

  if (species.length === 0) return null

  return (
    <Section id="biodiversidad" className="bg-dark-900">
      <Container>
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-400 uppercase">
            Biodiversidad Amazónica
          </p>
          <h2 className="mb-4 text-center text-4xl font-bold text-white md:text-5xl">
            Especies que{' '}
            <span className="text-secondary-400">protegemos</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-white/60">
            Conoce algunas de las especies emblemáticas que habitan en los bosques que restauramos.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {species.map((s, i) => (
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
                onClick={() => onNavigate(`/especies/${s.slug}`)}
              />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 text-center">
            <Link to="/especies">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10" rightIcon={<ArrowRight size={18} />}>
                Explorar todas las especies
              </Button>
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

function GallerySection() {
  const allImages = galleryData.flatMap(g => g.images.map(img => ({ ...img, albumTitle: g.title })))
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (allImages.length === 0) return null

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <Section id="galeria" className="bg-neutral-50">
      <Container>
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">
            Galería
          </p>
          <h2 className="mb-4 text-center text-4xl font-bold text-dark-900 md:text-5xl">
            Momentos que{' '}
            <span className="text-primary-600">inspiran</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-neutral-600">
            Explora nuestra galería de imágenes y conecta con la belleza de la Amazonía.
          </p>
        </Reveal>
      </Container>

      <div className="mx-auto max-w-7xl px-4">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {allImages.map((img, i) => (
            <Reveal key={img.id} direction="up" delay={Math.min(i * 0.05, 0.3)}>
              <div className="mb-4 break-inside-avoid">
                <GalleryCard
                  image={{ src: img.src, alt: img.alt, caption: img.caption }}
                  onClick={() => openLightbox(i)}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Lightbox
        images={allImages.map(img => ({ src: img.src, alt: img.alt }))}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </Section>
  )
}

function TestimonialsSection() {
  const testimonials = testimonialsData.filter(t => t.name && t.quote)

  if (testimonials.length === 0) return null

  return (
    <Section id="testimonios" className="relative overflow-hidden bg-dark-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-800/10 via-transparent to-transparent" />

      <Container className="relative z-10">
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-400 uppercase">
            Testimonios
          </p>
          <h2 className="mb-12 text-center text-4xl font-bold text-white md:text-5xl">
            Voces que{' '}
            <span className="text-secondary-400">inspiran</span>
          </h2>
        </Reveal>

        <SwiperSlider
          slidesPerView={1}
          spaceBetween={24}
          pagination
          loop
          autoplay
          className="pb-12"
          swiperOptions={{
            breakpoints: {
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            },
          }}
        >
          {testimonials.map((t) => (
            <CardBase key={t.id} variant="default" className="relative h-full border-primary-800/20 bg-white/5 backdrop-blur-sm">
              <Quote className="mb-4 h-8 w-8 text-secondary-400/40" />
              <blockquote className="mb-6 text-sm leading-relaxed text-white/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-auto flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary-800/50">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-secondary-400">
                      {t.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/50">{t.role}</p>
                </div>
              </div>
            </CardBase>
          ))}
        </SwiperSlider>
      </Container>
    </Section>
  )
}

function PartnersSection() {
  const partners = partnersData.filter(p => p.name && p.logo)

  if (partners.length === 0) return null

  const duplicated = [...partners, ...partners]

  return (
    <Section id="aliados" className="overflow-hidden">
      <Container>
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">
            Aliados
          </p>
          <h2 className="mb-4 text-center text-4xl font-bold text-dark-900 md:text-5xl">
            Organizaciones que{' '}
            <span className="text-primary-600">confían en nosotros</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-neutral-600">
            Trabajamos junto a las mejores organizaciones nacionales e internacionales.
          </p>
        </Reveal>
      </Container>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

        <motion.div
          className="flex gap-8"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {duplicated.map((partner, i) => (
            <div key={`${partner.id}-${i}`} className="flex w-40 shrink-0 items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-neutral-100 p-4 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  className="h-full w-full"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center text-xs font-medium text-neutral-400">
                      {partner.name.charAt(0)}
                    </div>
                  }
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}

function JoinSection() {
  return (
    <Section id="unete" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-dark-800 to-dark-900" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-secondary-500/10 via-transparent to-transparent" />

      <Container className="relative z-10">
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-400 uppercase">
            Únete
          </p>
          <h2 className="mb-4 text-center text-4xl font-bold text-white md:text-5xl">
            Sé parte del{' '}
            <span className="text-secondary-400">cambio</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-white/60">
            Hay muchas formas de contribuir a la protección de la Amazonía peruana.
            Elige la que más se alinee contigo.
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
          <Reveal direction="left">
            <CardBase variant="default" className="group relative overflow-hidden border-primary-700/30 bg-white/5 backdrop-blur-sm">
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl" />
              <div className="relative z-10 p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-500/20 text-secondary-400">
                  <Heart size={32} />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">Voluntariado</h3>
                <p className="mb-6 text-white/60">
                  Únete a nuestras jornadas de reforestación, talleres educativos y expediciones
                  de monitoreo. Tu tiempo y entusiasmo pueden marcar la diferencia.
                </p>
                <Link to="/voluntariado">
                  <Button variant="secondary" size="lg" rightIcon={<ArrowRight size={18} />}>
                    Quiero ser voluntario
                  </Button>
                </Link>
              </div>
            </CardBase>
          </Reveal>

          <Reveal direction="right">
            <CardBase variant="default" className="group relative overflow-hidden border-primary-700/30 bg-white/5 backdrop-blur-sm">
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-gold-500/10 blur-3xl" />
              <div className="relative z-10 p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500/20 text-gold-400">
                  <Leaf size={32} />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">Donaciones</h3>
                <p className="mb-6 text-white/60">
                  Tu contribución económica nos permite plantar más árboles, educar a más niños
                  y proteger más especies. Cada donación cuenta.
                </p>
                <Link to="/donaciones">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
                    Haz una donación
                  </Button>
                </Link>
              </div>
            </CardBase>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

function NewsSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const articles = newsData
    .filter(n => n.title)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)

  if (articles.length === 0) return null

  return (
    <Section id="noticias" className="bg-neutral-50">
      <Container>
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">
            Noticias
          </p>
          <h2 className="mb-4 text-center text-4xl font-bold text-dark-900 md:text-5xl">
            Últimas{' '}
            <span className="text-primary-600">novedades</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-neutral-600">
            Mantente informado sobre nuestras actividades, logros y próximos eventos.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article, i) => (
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
                onClick={() => onNavigate(`/noticias/${article.slug}`)}
              />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 text-center">
            <Link to="/noticias">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight size={18} />}>
                Ver todas las noticias
              </Button>
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

function FAQSection() {
  const faqs = faqData.filter(f => f.question && f.answer)
  const [openId, setOpenId] = useState<string | null>(null)

  if (faqs.length === 0) return null

  return (
    <Section id="faq">
      <Container>
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">
            Preguntas Frecuentes
          </p>
          <h2 className="mb-12 text-center text-4xl font-bold text-dark-900 md:text-5xl">
            Resolvemos tus{' '}
            <span className="text-primary-600">dudas</span>
          </h2>
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={faq.id} direction="up" delay={i * 0.05}>
              <ExpandableCard
                title={faq.question}
                preview=""
                expanded={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              >
                <p className="text-neutral-600">{faq.answer}</p>
              </ExpandableCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function ContactSection() {
  return (
    <Section id="contacto" className="bg-neutral-50">
      <Container>
        <Reveal>
          <p className="mb-2 text-center text-sm font-semibold tracking-widest text-secondary-600 uppercase">
            Contacto
          </p>
          <h2 className="mb-4 text-center text-4xl font-bold text-dark-900 md:text-5xl">
            Hablemos
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-neutral-600">
            ¿Tienes preguntas, ideas o quieres colaborar con nosotros? Estaremos encantados de escucharte.
          </p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal direction="left">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 via-accent-50 to-secondary-100" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark-800">Dirección</p>
                    <p className="text-sm text-neutral-600">{organizationData.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark-800">Correo</p>
                    <p className="text-sm text-neutral-600">{organizationData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark-800">Teléfono</p>
                    <p className="text-sm text-neutral-600">{organizationData.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <CardBase variant="default" className="h-full">
              <h3 className="mb-6 text-xl font-bold text-dark-800">Envíanos un mensaje</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Nombre" placeholder="Tu nombre" required />
                  <Input label="Correo" type="email" placeholder="tu@correo.com" required />
                </div>
                <Input label="Asunto" placeholder="¿Sobre qué quieres hablarnos?" />
                <Textarea label="Mensaje" placeholder="Cuéntanos más..." rows={4} required />
                <Button type="submit" variant="primary" size="lg" fullWidth rightIcon={<Send size={16} />}>
                  Enviar mensaje
                </Button>
              </form>
            </CardBase>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

function NewsletterSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-800 to-dark-800 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary-500/10 via-transparent to-transparent" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h3 className="mb-3 text-3xl font-bold text-white">Mantente informado</h3>
            <p className="mb-8 text-white/60">
              Recibe nuestras noticias, eventos y formas de participar directamente en tu correo.
            </p>
          </Reveal>

          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              placeholder="tu@correo.com"
              className="flex-1"
              size="lg"
              required
            />
            <Button type="submit" variant="secondary" size="lg" rightIcon={<Send size={16} />}>
              Suscribirme
            </Button>
          </form>
          <p className="mt-3 text-xs text-white/40">
            Sin spam. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </Container>
    </section>
  )
}

export default function HomePage() {
  const navigate = useNavigate()

  const goTo = (path: string) => navigate(path)

  return (
    <PageTransition>
      <OrganizationSchema />
      <SEO
        title="Inicio"
        description="Sembrando Huellas Perú — Organización peruana dedicada a la conservación de la Amazonía, reforestación participativa y educación ambiental. Únete a nuestra misión."
      />

      <HeroSection />

      <div className="relative">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-dark-950 to-transparent" />
      </div>

      <AboutSection />
      <MissionSection />
      <ImpactSection />
      <ProgramsSection />
      <ProjectsSection onNavigate={goTo} />
      <SpeciesSection onNavigate={goTo} />
      <GallerySection />
      <TestimonialsSection />
      <PartnersSection />
      <JoinSection />
      <NewsSection onNavigate={goTo} />
      <FAQSection />
      <ContactSection />
      <NewsletterSection />
    </PageTransition>
  )
}
