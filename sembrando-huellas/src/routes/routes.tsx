import { lazy, Suspense } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import { MainLayout, ErrorLayout, AdminLayout } from '@/layouts'
import Loader from '@/components/ui/Loader'
import { adminRoutes } from './AdminRoutes'

function LazyComponent(importFn: () => Promise<{ default: React.ComponentType }>) {
  const Component = lazy(importFn)
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  )
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorLayout />,
    children: [
      { index: true, element: LazyComponent(() => import('@/features/home/pages/HomePage')) },
      { path: 'nosotros', element: LazyComponent(() => import('@/features/about/pages/AboutPage')) },
      { path: 'programas', element: LazyComponent(() => import('@/features/programs/pages/ProgramsPage')) },
      { path: 'programas/:slug', element: LazyComponent(() => import('@/features/programs/pages/ProgramDetailPage')) },
      { path: 'educacion', element: LazyComponent(() => import('@/features/education/pages/EducationPage')) },
      { path: 'proyectos', element: LazyComponent(() => import('@/features/projects/pages/ProjectsPage')) },
      { path: 'proyectos/:slug', element: LazyComponent(() => import('@/features/projects/pages/ProjectDetailPage')) },
      { path: 'especies', element: LazyComponent(() => import('@/features/species/pages/SpeciesPage')) },
      { path: 'especies/:slug', element: LazyComponent(() => import('@/features/species/pages/SpeciesDetailPage')) },
      { path: 'galeria', element: LazyComponent(() => import('@/features/gallery/pages/GalleryPage')) },
      { path: 'noticias', element: LazyComponent(() => import('@/features/news/pages/NewsPage')) },
      { path: 'noticias/:slug', element: LazyComponent(() => import('@/features/news/pages/ArticleDetailPage')) },
      { path: 'impacto', element: LazyComponent(() => import('@/features/impact/pages/ImpactPage')) },
      { path: 'voluntariado', element: LazyComponent(() => import('@/features/volunteers/pages/VolunteersPage')) },
      { path: 'donaciones', element: LazyComponent(() => import('@/features/donations/pages/DonationsPage')) },
      { path: 'contacto', element: LazyComponent(() => import('@/features/contact/pages/ContactPage')) },
      { path: 'faq', element: LazyComponent(() => import('@/features/faq/pages/FAQPage')) },
      { path: 'politicas', element: LazyComponent(() => import('@/features/policies/pages/PrivacyPage')) },
      { path: 'terminos', element: LazyComponent(() => import('@/features/policies/pages/TermsPage')) },
      { path: 'biblioteca', element: LazyComponent(() => import('@/features/library/pages/LibraryPage')) },
      { path: 'calendario', element: LazyComponent(() => import('@/features/calendar/pages/CalendarPage')) },
      { path: 'calculadora', element: LazyComponent(() => import('@/features/calculator/pages/CalculatorPage')) },
      { path: 'multimedia', element: LazyComponent(() => import('@/features/multimedia/pages/MultimediaPage')) },
      { path: 'mapa-interactivo', element: LazyComponent(() => import('@/features/mapa/pages/MapPage')) },
      { path: 'asistente-ia', element: LazyComponent(() => import('@/features/ai/pages/AiAssistantPage')) },
      { path: 'tutor-ia', element: LazyComponent(() => import('@/features/eis/pages/TutorPage')) },
      { path: 'identificador-avanzado', element: LazyComponent(() => import('@/features/eis/pages/SpeciesV2Page')) },
      { path: 'observatorio', element: LazyComponent(() => import('@/features/eis/pages/ObservatoryPage')) },
      { path: 'analisis-documentos', element: LazyComponent(() => import('@/features/eis/pages/DocumentAnalysisPage')) },
      { path: 'planificador-actividades', element: LazyComponent(() => import('@/features/eis/pages/ActivityPlannerPage')) },
      { path: 'certificados', element: LazyComponent(() => import('@/features/eis/pages/CertificatesPage')) },
      { path: 'analitica-ia', element: LazyComponent(() => import('@/features/eis/pages/AnalyticsPage')) },
      { path: 'rag', element: LazyComponent(() => import('@/features/eis/pages/RAGPage')) },
      { path: 'recomendador', element: LazyComponent(() => import('@/features/eis/pages/RecommenderPage')) },
      { path: 'transparencia', element: LazyComponent(() => import('@/features/sia/pages/SiaTransparencyPage')) },
      { path: '404', element: LazyComponent(() => import('@/features/not-found/pages/NotFoundPage')) },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
  {
    path: '/dashboard',
    element: <AdminLayout />,
    children: [
      { index: true, element: LazyComponent(() => import('@/features/dashboard/pages/DashboardPage')) },
    ],
  },
  ...adminRoutes,
]
