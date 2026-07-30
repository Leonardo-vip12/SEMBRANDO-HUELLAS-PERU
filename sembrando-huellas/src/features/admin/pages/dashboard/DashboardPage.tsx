import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TreePine, Users, GraduationCap, Newspaper, Bird, Briefcase, DollarSign, Heart, TrendingUp, Activity, FileText, Calendar } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{t('admin.dashboard')}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t('admin.welcomeMessage', 'Bienvenido al panel de administración de Sembrando Huellas Perú')}</p>
      </div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label={t('admin.treesPlanted', 'Árboles Plantados')} value="52,000+" icon={<TreePine size={22} />} trend={{ value: 12, positive: true }} />
        <StatsCard label={t('admin.volunteersRegistered', 'Voluntarios Registrados')} value="1,800" icon={<Users size={22} />} trend={{ value: 8, positive: true }} />
        <StatsCard label={t('admin.studentsImpacted', 'Estudiantes Impactados')} value="30,000+" icon={<GraduationCap size={22} />} trend={{ value: 5, positive: true }} />
        <StatsCard label={t('admin.donationsReceived', 'Donaciones Recibidas')} value="S/ 128,500" icon={<DollarSign size={22} />} trend={{ value: 3, positive: true }} />
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label={t('admin.newsPublished', 'Noticias Publicadas')} value="24" icon={<Newspaper size={22} />} color="text-blue-600" />
        <StatsCard label={t('admin.speciesMonitored', 'Especies Monitoreadas')} value="240" icon={<Bird size={22} />} color="text-amber-600" />
        <StatsCard label={t('admin.activeProjects', 'Proyectos Activos')} value="12" icon={<Briefcase size={22} />} color="text-green-600" />
        <StatsCard label={t('admin.communitiesServed', 'Comunidades Atendidas')} value="45" icon={<Heart size={22} />} color="text-red-600" />
      </motion.div>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{t('admin.recentActivity', 'Actividad Reciente')}</h3>
          <div className="space-y-3">
            {[
              { icon: <FileText size={14} />, text: t('admin.activityArticlePublished', 'Nuevo artículo publicado: "Reforestación 2025"'), time: t('admin.minutesAgo', { count: 5 }), color: 'text-blue-500' },
              { icon: <Users size={14} />, text: t('admin.activityVolunteerRegistered', 'Nuevo voluntario registrado: María López'), time: t('admin.minutesAgo', { count: 15 }), color: 'text-green-500' },
              { icon: <Calendar size={14} />, text: t('admin.activityEventUpdated', 'Evento actualizado: "Jornada de Reforestación"'), time: t('admin.hourAgo', 'Hace 1 h'), color: 'text-purple-500' },
              { icon: <Bird size={14} />, text: t('admin.activitySpeciesAdded', 'Nueva especie añadida: Oso Hormiguero Gigante'), time: t('admin.hoursAgo', { count: 2 }), color: 'text-amber-500' },
              { icon: <Heart size={14} />, text: t('admin.activityDonationReceived', 'Donación recibida: S/ 2,500.00'), time: t('admin.hoursAgo', { count: 3 }), color: 'text-red-500' },
              { icon: <Activity size={14} />, text: t('admin.activityProjectUpdated', 'Proyecto "Corredor Biológico" actualizado al 75%'), time: t('admin.hoursAgo', { count: 5 }), color: 'text-cyan-500' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-700 ${a.color}`}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-neutral-700 dark:text-neutral-300">{a.text}</p>
                  <p className="text-xs text-neutral-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{t('admin.quickActions', 'Acciones Rápidas')}</h3>
          <div className="space-y-2">
            {[
              { label: t('admin.newNews', 'Nueva Noticia'), icon: <Newspaper size={16} />, href: '/admin/noticias/nuevo' },
              { label: t('admin.newProject', 'Nuevo Proyecto'), icon: <Briefcase size={16} />, href: '/admin/proyectos/nuevo' },
              { label: t('admin.newEvent', 'Nuevo Evento'), icon: <Calendar size={16} />, href: '/admin/eventos/nuevo' },
              { label: t('admin.newSpecies', 'Nueva Especie'), icon: <Bird size={16} />, href: '/admin/especies/nuevo' },
              { label: t('admin.viewReports', 'Ver Reportes'), icon: <TrendingUp size={16} />, href: '/admin/impacto' },
            ].map((action, i) => (
              <a
                key={i}
                href={action.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-neutral-300 dark:hover:bg-primary-900/20 dark:hover:text-primary-300"
              >
                <span className="text-primary-500">{action.icon}</span>
                {action.label}
              </a>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('admin.summary', 'Resumen')}</h4>
            <div className="space-y-3">
              {[
                { label: t('admin.publishedContent', 'Contenido publicado'), value: '85%', color: 'bg-green-500' },
                { label: t('admin.drafts', 'Borradores'), value: '12%', color: 'bg-amber-500' },
                { label: t('admin.archivedContent', 'Archivados'), value: '3%', color: 'bg-neutral-400' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-neutral-500">{s.label}</span>
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">{s.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-700">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: s.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{t('admin.contentDistribution', 'Distribución de Contenido')}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t('admin.news'), value: 24, max: 50, color: 'bg-blue-500' },
            { label: t('admin.projects'), value: 12, max: 50, color: 'bg-green-500' },
            { label: t('admin.species'), value: 8, max: 50, color: 'bg-amber-500' },
            { label: t('admin.events'), value: 6, max: 50, color: 'bg-purple-500' },
          ].map((bar) => (
            <div key={bar.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">{bar.label}</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{bar.value}</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-700">
                <div className={`h-full rounded-full ${bar.color} transition-all duration-500`} style={{ width: `${(bar.value / bar.max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
