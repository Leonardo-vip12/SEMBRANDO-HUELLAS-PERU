import { useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionTitle from '@/components/ui/SectionTitle'
import { cn } from '@/lib/cn'

interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

interface GallerySectionProps {
  title?: string
  subtitle?: string
  images: GalleryImage[]
  columns?: 2 | 3 | 4
  lightbox?: boolean
}

export default function GallerySection({
  title,
  subtitle,
  images,
  columns = 3,
  lightbox = false,
}: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null)
    document.body.style.overflow = ''
  }, [])

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null))
  }, [images.length])

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null))
  }, [images.length])

  return (
    <section className="py-16 md:py-24">
      <Container>
        {title && <SectionTitle title={title} subtitle={subtitle} />}
        <div
          className={cn(
            'grid grid-cols-1 gap-4',
            columns >= 2 && 'sm:grid-cols-2',
            columns >= 3 && 'lg:grid-cols-3',
            columns >= 4 && 'xl:grid-cols-4'
          )}
        >
          {images.map((image, index) => (
            <div
              key={image.src}
              className={cn(
                'group relative overflow-hidden rounded-lg',
                lightbox && 'cursor-pointer'
              )}
              onClick={() => lightbox && openLightbox(index)}
              role={lightbox ? 'button' : undefined}
              tabIndex={lightbox ? 0 : undefined}
              onKeyDown={(e) => {
                if (lightbox && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  openLightbox(index)
                }
              }}
              aria-label={lightbox ? `Open ${image.alt} in lightbox` : image.alt}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              {image.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-sm text-white">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>

      {lightbox && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev() }}
                className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <img
            src={images[selectedIndex].src}
            alt={images[selectedIndex].alt}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
