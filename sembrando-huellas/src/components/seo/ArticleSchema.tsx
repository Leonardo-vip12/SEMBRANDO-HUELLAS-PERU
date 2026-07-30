import { Helmet } from 'react-helmet-async';
import { siteConfig } from '@/config/site';

interface ArticleSchemaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  author: string;
  publishedTime: string;
  tags?: string[];
}

export function ArticleSchema({
  title,
  description,
  image,
  url,
  author,
  publishedTime,
  tags,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image || `${siteConfig.url}/og-default.jpg`,
    url: url || siteConfig.url,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: publishedTime,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url || siteConfig.url,
    },
    ...(tags && tags.length > 0 ? { keywords: tags.join(', ') } : {}),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}