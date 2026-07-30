import { motion } from 'framer-motion';
import {
  Gauge, Bird, Map, LineChart, FileSpreadsheet, BarChart3, PenTool, AlertTriangle,
  GitCompare, Database, Globe, Eye, Monitor, Activity, Brain
} from 'lucide-react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };

const modules = [
  { label: 'Dashboard Ejecutivo', href: '/admin/sia/dashboard', icon: <Gauge size={22} />, desc: 'Indicadores clave y filtros', color: 'text-emerald-500' },
  { label: 'Observatorio Biodiversidad', href: '/admin/sia/biodiversidad', icon: <Bird size={22} />, desc: 'Distribución, mapas, conservación', color: 'text-green-500' },
  { label: 'Mapas Temáticos', href: '/admin/sia/mapas', icon: <Map size={22} />, desc: 'Capas, leyenda, búsqueda', color: 'text-blue-500' },
  { label: 'Análisis Estadístico', href: '/admin/sia/analitica', icon: <LineChart size={22} />, desc: 'Gráficos dinámicos interactivos', color: 'text-indigo-500' },
  { label: 'Reportes', href: '/admin/sia/reportes', icon: <FileSpreadsheet size={22} />, desc: 'Generación PDF/Excel/CSV', color: 'text-amber-500' },
  { label: 'Indicadores', href: '/admin/sia/indicadores', icon: <BarChart3 size={22} />, desc: 'Configurables desde CMS', color: 'text-purple-500' },
  { label: 'Ciencia Ciudadana', href: '/admin/sia/ciencia-ciudadana', icon: <PenTool size={22} />, desc: 'Validación y revisión', color: 'text-cyan-500' },
  { label: 'Alertas', href: '/admin/sia/alertas', icon: <AlertTriangle size={22} />, desc: 'Umbrales y notificaciones', color: 'text-red-500' },
  { label: 'Comparador', href: '/admin/sia/comparador', icon: <GitCompare size={22} />, desc: 'Regiones, instituciones, períodos', color: 'text-orange-500' },
  { label: 'Centro de Datos', href: '/admin/sia/centro-datos', icon: <Database size={22} />, desc: 'Datasets y series históricas', color: 'text-violet-500' },
  { label: 'Analítica Geoespacial', href: '/admin/sia/geoespacial', icon: <Globe size={22} />, desc: 'Clustering, buffers, PostGIS', color: 'text-teal-500' },
  { label: 'Informes con IA', href: '/admin/sia/informes-ia', icon: <Brain size={22} />, desc: 'Resúmenes y tendencias IA', color: 'text-pink-500' },
  { label: 'Transparencia', href: '/admin/sia/transparencia', icon: <Eye size={22} />, desc: 'Portal público de indicadores', color: 'text-sky-500' },
  { label: 'Monitoreo', href: '/admin/sia/monitoreo', icon: <Monitor size={22} />, desc: 'Estado del sistema y servicios', color: 'text-neutral-500' },
];

export default function SiaLandingPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
            <Activity size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Sistema Inteligente de Información Ambiental
            </h1>
            <p className="text-sm text-neutral-500">
              Centro de monitoreo, análisis y visualización de información ambiental
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((m) => (
          <a
            key={m.label}
            href={m.href}
            className="group rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div className={`mb-3 ${m.color}`}>{m.icon}</div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {m.label}
            </h3>
            <p className="mt-1 text-xs text-neutral-400">{m.desc}</p>
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/30 dark:bg-emerald-900/10">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">Acerca del SIA</h3>
            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
              El Sistema Inteligente de Información Ambiental (SIA) recopila, analiza y visualiza
              información ambiental para instituciones educativas, investigadores, docentes, voluntarios,
              autoridades, organizaciones aliadas y la ciudadanía en general. Todos los datos se consumen
              mediante la API del Sistema.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
