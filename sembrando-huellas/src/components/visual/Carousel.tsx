import { useState, useEffect, useCallback, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface CarouselImage {
  src: string
  alt: string
  caption?: string
}

interface CarouselProps {
  images: CarouselImage[]
  autoPlay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  ({ images, autoPlay = false, interval = 5000, showDots = true, showArrows = true }, ref) => {
    const [[currentIndex, direction], setPage] = useState([0, 0])

    const goTo = useCallback(
      (index: number) => {
        setPage([index, index > currentIndex ? 1 : -1])
      },
      [currentIndex]
    )

    const goToPrev = useCallback(() => {
      const prev = currentIndex === 0 ? images.length - 1 : currentIndex - 1
      setPage([prev, -1])
    }, [currentIndex, images.length])

    const goToNext = useCallback(() => {
      const next = currentIndex === images.length - 1 ? 0 : currentIndex + 1
      setPage([next, 1])
    }, [currentIndex, images.length])

    useEffect(() => {
      if (!autoPlay || images.length <= 1) return
      const timer = setInterval(goToNext, interval)
      return () => clearInterval(timer)
    }, [autoPlay, interval, goToNext, images.length])

    if (images.length === 0) return null

    return (
      <div ref={ref} className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <div className="relative aspect-video">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>

          {images[currentIndex].caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-sm text-white">{images[currentIndex].caption}</p>
            </div>
          )}
        </div>

        {showArrows && images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow backdrop-blur transition-colors hover:bg-white dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow backdrop-blur transition-colors hover:bg-white dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {showDots && images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  'h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  index === currentIndex
                    ? 'w-6 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)

Carousel.displayName = 'Carousel'

export default Carousel
