import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const labelMap: Record<string, string> = {
  '': 'Dashboard',
  organizacion: 'Organización',
  noticias: 'Noticias',
  categorias: 'Categorías',
  programas: 'Programas',
  proyectos: 'Proyectos',
  especies: 'Especies',
  galeria: 'Galería',
  biblioteca: 'Biblioteca',
  eventos: 'Eventos',
  faq: 'FAQ',
  aliados: 'Aliados',
  voluntarios: 'Voluntarios',
  equipo: 'Equipo',
  impacto: 'Impacto',
  testimonios: 'Testimonios',
  donaciones: 'Donaciones',
  usuarios: 'Usuarios',
  roles: 'Roles',
  configuracion: 'Configuración',
  logs: 'Logs',
};

export default function AdminBreadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.replace('/admin', '').split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
      <Link
        to="/admin"
        className="flex items-center gap-1 rounded px-1.5 py-1 text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
      >
        <Home size={14} />
      </Link>
      {segments.map((seg, i) => {
        const href = '/admin/' + segments.slice(0, i + 1).join('/');
        const label = labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
        const isLast = i === segments.length - 1;

        return (
          <span key={seg} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-neutral-300" />
            {isLast ? (
              <span className="font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
            ) : (
              <Link to={href} className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
