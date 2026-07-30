import { lazy, Suspense } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import AdminLayoutInner from '@/features/admin/components/layout/AdminLayoutInner';
import Loader from '@/components/ui/Loader';

function Lazy(importFn: () => Promise<{ default: React.ComponentType }>) {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
}

export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: <AdminLayoutInner />,
    children: [
      { index: true, element: Lazy(() => import('@/features/admin/pages/dashboard/DashboardPage')) },
      { path: 'organizacion', element: Lazy(() => import('@/features/admin/pages/organization/OrganizationPage')) },
      { path: 'noticias', element: Lazy(() => import('@/features/admin/pages/news/NewsListPage')) },
      { path: 'noticias/nuevo', element: Lazy(() => import('@/features/admin/pages/news/NewsFormPage')) },
      { path: 'noticias/:id', element: Lazy(() => import('@/features/admin/pages/news/NewsFormPage')) },
      { path: 'categorias', element: Lazy(() => import('@/features/admin/pages/categories/CategoriesPage')) },
      { path: 'programas', element: Lazy(() => import('@/features/admin/pages/programs/ProgramsListPage')) },
      { path: 'proyectos', element: Lazy(() => import('@/features/admin/pages/projects/ProjectsListPage')) },
      { path: 'especies', element: Lazy(() => import('@/features/admin/pages/species/SpeciesListPage')) },
      { path: 'galeria', element: Lazy(() => import('@/features/admin/pages/gallery/GalleryListPage')) },
      { path: 'biblioteca', element: Lazy(() => import('@/features/admin/pages/library/LibraryListPage')) },
      { path: 'eventos', element: Lazy(() => import('@/features/admin/pages/events/EventsListPage')) },
      { path: 'faq', element: Lazy(() => import('@/features/admin/pages/faq/FAQListPage')) },
      { path: 'aliados', element: Lazy(() => import('@/features/admin/pages/partners/PartnersListPage')) },
      { path: 'voluntarios', element: Lazy(() => import('@/features/admin/pages/volunteers/VolunteersListPage')) },
      { path: 'equipo', element: Lazy(() => import('@/features/admin/pages/team/TeamListPage')) },
      { path: 'impacto', element: Lazy(() => import('@/features/admin/pages/impact/ImpactPage')) },
      { path: 'testimonios', element: Lazy(() => import('@/features/admin/pages/testimonials/TestimonialsListPage')) },
      { path: 'donaciones', element: Lazy(() => import('@/features/admin/pages/donations/DonationsPage')) },
      { path: 'usuarios', element: Lazy(() => import('@/features/admin/pages/users/UsersListPage')) },
      { path: 'usuarios/nuevo', element: Lazy(() => import('@/features/admin/pages/users/UserFormPage')) },
      { path: 'usuarios/:id', element: Lazy(() => import('@/features/admin/pages/users/UserFormPage')) },
      { path: 'roles', element: Lazy(() => import('@/features/admin/pages/roles/RolesPage')) },
      { path: 'configuracion', element: Lazy(() => import('@/features/admin/pages/settings/SettingsPage')) },
      { path: 'logs', element: Lazy(() => import('@/features/admin/pages/logs/LogsPage')) },
      { path: 'ia', element: Lazy(() => import('@/features/admin/pages/ai/AiDashboardPage')) },
      { path: 'eis', element: Lazy(() => import('@/features/admin/pages/eis/EisDashboardPage')) },
      { path: 'eis/certificados', element: Lazy(() => import('@/features/eis/pages/CertificatesPage')) },
      { path: 'eis/analitica', element: Lazy(() => import('@/features/eis/pages/AnalyticsPage')) },
      { path: 'eis/rag', element: Lazy(() => import('@/features/eis/pages/RAGPage')) },
      { path: 'eis/recomendador', element: Lazy(() => import('@/features/eis/pages/RecommenderPage')) },
      { path: 'sia', element: Lazy(() => import('@/features/sia/pages/SiaLandingPage')) },
      { path: 'sia/dashboard', element: Lazy(() => import('@/features/sia/pages/SiaDashboardPage')) },
      { path: 'sia/biodiversidad', element: Lazy(() => import('@/features/sia/pages/SiaBiodiversityPage')) },
      { path: 'sia/mapas', element: Lazy(() => import('@/features/sia/pages/SiaMapsPage')) },
      { path: 'sia/analitica', element: Lazy(() => import('@/features/sia/pages/SiaAnalyticsPage')) },
      { path: 'sia/reportes', element: Lazy(() => import('@/features/sia/pages/SiaReportsPage')) },
      { path: 'sia/indicadores', element: Lazy(() => import('@/features/sia/pages/SiaIndicatorsPage')) },
      { path: 'sia/ciencia-ciudadana', element: Lazy(() => import('@/features/sia/pages/SiaCitizenSciencePage')) },
      { path: 'sia/alertas', element: Lazy(() => import('@/features/sia/pages/SiaAlertsPage')) },
      { path: 'sia/comparador', element: Lazy(() => import('@/features/sia/pages/SiaComparatorPage')) },
      { path: 'sia/centro-datos', element: Lazy(() => import('@/features/sia/pages/SiaDataCenterPage')) },
      { path: 'sia/geoespacial', element: Lazy(() => import('@/features/sia/pages/SiaGeospatialPage')) },
      { path: 'sia/informes-ia', element: Lazy(() => import('@/features/sia/pages/SiaAiReportsPage')) },
      { path: 'sia/transparencia', element: Lazy(() => import('@/features/sia/pages/SiaTransparencyPage')) },
      { path: 'sia/monitoreo', element: Lazy(() => import('@/features/sia/pages/SiaMonitoringPage')) },
      { path: 'traducciones', element: Lazy(() => import('@/features/admin/pages/translations/TranslationPage')) },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },
];
