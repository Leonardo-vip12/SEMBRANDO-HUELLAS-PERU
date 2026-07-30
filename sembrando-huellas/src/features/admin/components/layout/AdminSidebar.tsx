import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Newspaper, FolderTree, TreePine, Briefcase, Bird, Image, Calendar,
  HelpCircle, Handshake, Users, UserCircle, BarChart3, MessageSquare, DollarSign, Shield,
  Settings, FileText, Activity, PanelRightClose, PanelRightOpen,
  Library, Bot, Brain, LineChart, Map, FileSpreadsheet,
  Gauge, AlertTriangle, GitCompare, Database, Globe, PenTool, Eye, Monitor,
  Languages
} from 'lucide-react';
import { cn } from '@/lib/cn';

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

function useNavSections(): NavSection[] {
  const { t } = useTranslation();
  return [
    {
      label: t('admin.general'),
      items: [
        { label: t('admin.dashboard'), href: '/admin', icon: <LayoutDashboard size={18} /> },
        { label: t('admin.organization'), href: '/admin/organizacion', icon: <FileText size={18} /> },
        { label: t('admin.news'), href: '/admin/noticias', icon: <Newspaper size={18} /> },
        { label: t('admin.categories'), href: '/admin/categorias', icon: <FolderTree size={18} /> },
      ],
    },
    {
      label: t('admin.content'),
      items: [
        { label: t('admin.programs'), href: '/admin/programas', icon: <TreePine size={18} /> },
        { label: t('admin.projects'), href: '/admin/proyectos', icon: <Briefcase size={18} /> },
        { label: t('admin.species'), href: '/admin/especies', icon: <Bird size={18} /> },
        { label: t('admin.gallery'), href: '/admin/galeria', icon: <Image size={18} /> },
        { label: t('admin.library'), href: '/admin/biblioteca', icon: <Library size={18} /> },
        { label: t('admin.events'), href: '/admin/eventos', icon: <Calendar size={18} /> },
      ],
    },
    {
      label: t('admin.interaction'),
      items: [
        { label: t('admin.faq'), href: '/admin/faq', icon: <HelpCircle size={18} /> },
        { label: t('admin.partners'), href: '/admin/aliados', icon: <Handshake size={18} /> },
        { label: t('admin.volunteers'), href: '/admin/voluntarios', icon: <Users size={18} /> },
        { label: t('admin.team'), href: '/admin/equipo', icon: <UserCircle size={18} /> },
        { label: t('admin.testimonials'), href: '/admin/testimonios', icon: <MessageSquare size={18} /> },
      ],
    },
    {
      label: t('admin.management'),
      items: [
        { label: t('admin.impact'), href: '/admin/impacto', icon: <BarChart3 size={18} /> },
        { label: t('admin.donations'), href: '/admin/donaciones', icon: <DollarSign size={18} /> },
        { label: t('admin.users'), href: '/admin/usuarios', icon: <Shield size={18} /> },
        { label: t('admin.roles'), href: '/admin/roles', icon: <Shield size={18} /> },
      ],
    },
    {
      label: t('admin.ai'),
      items: [
        { label: t('admin.aiPanel', 'Panel IA'), href: '/admin/ia', icon: <Bot size={18} /> },
      ],
    },
    {
      label: t('admin.eis'),
      items: [
        { label: t('admin.eisPanel', 'Panel EIS'), href: '/admin/eis', icon: <Brain size={18} /> },
      ],
    },
    {
      label: t('admin.sia'),
      items: [
        { label: t('sia.dashboard'), href: '/admin/sia', icon: <Gauge size={18} /> },
        { label: t('sia.biodiversity'), href: '/admin/sia/biodiversidad', icon: <Bird size={18} /> },
        { label: t('sia.maps'), href: '/admin/sia/mapas', icon: <Map size={18} /> },
        { label: t('sia.analytics'), href: '/admin/sia/analitica', icon: <LineChart size={18} /> },
        { label: t('sia.indicators'), href: '/admin/sia/indicadores', icon: <BarChart3 size={18} /> },
      ],
    },
    {
      label: t('admin.siaTools', 'SIA - Herramientas'),
      items: [
        { label: t('sia.reports'), href: '/admin/sia/reportes', icon: <FileSpreadsheet size={18} /> },
        { label: t('sia.citizenScience'), href: '/admin/sia/ciencia-ciudadana', icon: <PenTool size={18} /> },
        { label: t('sia.alerts'), href: '/admin/sia/alertas', icon: <AlertTriangle size={18} /> },
        { label: t('sia.comparator'), href: '/admin/sia/comparador', icon: <GitCompare size={18} /> },
        { label: t('sia.dataCenter'), href: '/admin/sia/centro-datos', icon: <Database size={18} /> },
        { label: t('sia.geospatial'), href: '/admin/sia/geoespacial', icon: <Globe size={18} /> },
        { label: t('sia.aiReports'), href: '/admin/sia/informes-ia', icon: <PenTool size={18} /> },
        { label: t('sia.transparency'), href: '/admin/sia/transparencia', icon: <Eye size={18} /> },
        { label: t('sia.monitoring'), href: '/admin/sia/monitoreo', icon: <Monitor size={18} /> },
      ],
    },
    {
      label: t('admin.system'),
      items: [
        { label: t('admin.settings'), href: '/admin/configuracion', icon: <Settings size={18} /> },
        { label: t('admin.logs'), href: '/admin/logs', icon: <Activity size={18} /> },
        { label: t('admin.translations'), href: '/admin/traducciones', icon: <Languages size={18} /> },
      ],
    },
  ];
}

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const { pathname } = useLocation();
  const navSections = useNavSections();

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-neutral-200 bg-white transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className={cn('flex h-16 items-center border-b border-neutral-200 px-4 dark:border-neutral-800', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">SH</div>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Admin</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/admin" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">SH</Link>
        )}
        <button
          onClick={onToggle}
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
                    collapsed && 'justify-center px-0',
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="ml-auto rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary-500" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={cn('border-t border-neutral-200 p-3 dark:border-neutral-800', collapsed && 'flex justify-center')}>
        <div className={cn('flex items-center gap-3', collapsed && 'flex-col')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
            AD
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">Admin</p>
              <p className="truncate text-xs text-neutral-400">Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
