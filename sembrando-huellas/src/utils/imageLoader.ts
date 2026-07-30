type ImageFormat = 'webp' | 'jpeg' | 'png' | 'avif'

interface ImageParams {
  width?: number
  height?: number
  quality?: number
  format?: ImageFormat
}

const IMAGE_BASE_PATH = '/images'

export function getImageUrl(src: string, params: ImageParams = {}): string {
  const cleanSrc = src.replace(/^\//, '')
  let url = `${IMAGE_BASE_PATH}/${cleanSrc}`

  const searchParams = new URLSearchParams()
  if (params.width) searchParams.set('w', String(params.width))
  if (params.height) searchParams.set('h', String(params.height))
  if (params.quality) searchParams.set('q', String(params.quality))
  if (params.format) searchParams.set('fm', params.format)

  const qs = searchParams.toString()
  if (qs) url += `?${qs}`

  return url
}

export function getPlaceholder(src: string): string {
  return getImageUrl(src, { width: 20, quality: 10 })
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = reject
    image.src = src
  })
}
