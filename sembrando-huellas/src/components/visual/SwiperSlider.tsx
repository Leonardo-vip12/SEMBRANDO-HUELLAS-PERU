import { forwardRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { SwiperOptions } from 'swiper/types'
import { cn } from '@/lib/cn'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface SwiperSliderProps {
  children: React.ReactNode[]
  slidesPerView?: number
  spaceBetween?: number
  navigation?: boolean
  pagination?: boolean
  loop?: boolean
  autoplay?: boolean
  className?: string
  swiperOptions?: SwiperOptions
}

const SwiperSlider = forwardRef<HTMLDivElement, SwiperSliderProps>(
  (
    {
      children,
      slidesPerView = 1,
      spaceBetween = 0,
      navigation = false,
      pagination = false,
      loop = false,
      autoplay = false,
      className,
      swiperOptions,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('swiper-wrapper-custom', className)}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={slidesPerView}
          spaceBetween={spaceBetween}
          navigation={navigation}
          pagination={pagination ? { clickable: true } : false}
          loop={loop}
          autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
          {...swiperOptions}
        >
          {children.map((child, index) => (
            <SwiperSlide key={index}>{child}</SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  }
)

SwiperSlider.displayName = 'SwiperSlider'

export default SwiperSlider
