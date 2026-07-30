import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from '@/components/layout'
import SkipToContent from '@/components/navigation/SkipToContent'
import { SEO } from '@/components/seo'
import type { SEOData } from '@/types'

interface MainLayoutProps {
  seo?: SEOData
}

export default function MainLayout({ seo }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <SkipToContent />
      {seo && (
        <SEO
          title={seo.title}
          description={seo.description}
          image={seo.image}
          type={seo.type === 'article' ? 'article' : 'website'}
        />
      )}
      <Navbar />
      <main id="main-content" className="w-full flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}