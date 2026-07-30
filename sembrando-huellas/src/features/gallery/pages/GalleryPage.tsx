import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import GalleryCard from '@/components/cards/GalleryCard'
import Lightbox from '@/components/visual/Lightbox'
import { Reveal } from '@/components/animations/Reveal'
import PageHero from '@/components/ui/PageHero'
import galleryData from '@/data/json/gallery.json'

export default function GalleryPage() {
  const { t } = useTranslation()
  const albums = galleryData.filter(g => g.images.length > 0)
  const allImages = albums.flatMap(g => g.images.map(img => ({ ...img, albumTitle: g.title })))
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [category, setCategory] = useState('')

  const categories = [...new Set(albums.map(a => a.tags[0]).filter(Boolean))]
  const filteredAlbums = category ? albums.filter(a => a.tags.includes(category)) : albums

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: t('nav.home'), url: '/' }, { name: t('nav.gallery'), url: '/galeria' }]} />
      <SEO title={t('nav.gallery')} description={t('gallery.subtitle')} />

      <PageHero
        title={t('gallery.title')}
        subtitle={t('gallery.description')}
      />

      <Section>
        <Container>
          <div className="mb-8 flex flex-wrap gap-2">
            <button onClick={() => setCategory('')} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${!category ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{t('common.all')}</button>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${category === c ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{c}</button>
            ))}
          </div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {filteredAlbums.flatMap(g => g.images.map((img, i) => {
              const enriched = { ...img, albumTitle: g.title }
              return (
                <Reveal key={img.id} direction="up" delay={Math.min(i * 0.03, 0.2)}>
                  <div className="mb-4 break-inside-avoid">
                    <GalleryCard image={{ src: img.src, alt: img.alt, caption: img.caption }} onClick={() => openLightbox(allImages.indexOf(enriched))} />
                  </div>
                </Reveal>
              )
            }))}
          </div>

          <Lightbox images={allImages.map(img => ({ src: img.src, alt: img.alt }))} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
        </Container>
      </Section>
    </PageTransition>
  )
}
