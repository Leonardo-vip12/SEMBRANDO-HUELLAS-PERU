import type { SEOData } from '@/types'
import { siteConfig } from '@/config/site'
import { defaultSEO } from '@/config/seo'

export interface MetaTag {
  name?: string
  property?: string
  content: string
}

export function buildMeta(data?: Partial<SEOData>): MetaTag[] {
  const title = data?.title ?? defaultSEO.title
  const description = data?.description ?? defaultSEO.description
  const image = data?.image ?? defaultSEO.image
  const type = data?.type ?? defaultSEO.type

  const fullTitle = title === defaultSEO.title ? title : `${title} | ${siteConfig.name}`
  const imageUrl = image ? `${siteConfig.url}${image.startsWith('/') ? '' : '/'}${image}` : undefined

  const tags: MetaTag[] = [
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: siteConfig.url },
    { name: 'twitter:card', content: defaultSEO.twitterCard },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
  ]

  if (imageUrl) {
    tags.push(
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:image', content: imageUrl }
    )
  }

  return tags
}
