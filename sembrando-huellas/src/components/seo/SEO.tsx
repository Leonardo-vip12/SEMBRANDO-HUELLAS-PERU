import { Helmet } from 'react-helmet-async';
import { siteConfig } from '@/config/site';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
}

export function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  tags,
}: SEOProps) {
  const siteName = siteConfig.name;
  const defaultImage = `${siteConfig.url}/og-default.jpg`;
  const pageUrl = url || siteConfig.url;
  const pageTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image || defaultImage} />
      {publishedTime && (
        <meta property="og:article:published_time" content={publishedTime} />
      )}
      {tags?.map((tag) => (
        <meta key={tag} property="og:article:tag" content={tag} />
      ))}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}