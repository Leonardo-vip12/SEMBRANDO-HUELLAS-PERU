import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, GraduationCap, Camera, Bird, FileText, Calendar, BookOpen, Server, RefreshCw, Shield, Award, BarChart3, Database, Lightbulb } from 'lucide-react';
import { EisService } from '@/services/eis';
import StatsCard from '../../components/shared/StatsCard';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function EisDashboardPage() {
  const [kbStats, setKbStats] = useState<any>(null);
  const [speciesStats, setSpeciesStats] = useState<any>(null);
  const [obsStats, setObsStats] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [kb, species, obs, provs] = await Promise.all([
        EisService.knowledgeStats().catch(() => null),
        EisService.speciesStats().catch(() => null),
        EisService.observatoryStats().catch(() => null),
        EisService.getGatewayProviders().catch(() => []),
      ]);
      setKbStats(kb);
      setSpeciesStats(species);
      setObsStats(obs);
      setProviders(Array.isArray(provs) ? provs : []);
    } catch {}
    setLoading(false);
  }

  const modules = [
    { label: 'Tutor Adaptativo', href: '/admin/eis/tutor', icon: <GraduationCap size={22} />, desc: 'Tutor IA adaptativo por nivel', color: 'text-emerald-500' },
    { label: 'Identificador V2', href: '/admin/eis/species-v2', icon: <Camera size={22} />, desc: 'Taxonomía completa + bibliografía', color: 'text-blue-500' },
    { label: 'Observatorio', href: '/admin/eis/observatory', icon: <Bird size={22} />, desc: 'Observaciones de biodiversidad', color: 'text-green-500' },
    { label: 'Análisis Documentos', href: '/admin/eis/documents', icon: <FileText size={22} />, desc: 'Resúmenes, conceptos, preguntas', color: 'text-purple-500' },
    { label: 'Planificador', href: '/admin/eis/activities', icon: <Calendar size={22} />, desc: 'Actividades educativas con IA', color: 'text-orange-500' },
    { label: 'Base Conocimiento', href: '/admin/eis/knowledge-base', icon: <BookOpen size={22} />, desc: 'Gestión de knowledge base', color: 'text-cyan-500' },
    { label: 'AI Gateway', href: '/admin/eis/gateway', icon: <Server size={22} />, desc: 'Proveedores y failover', color: 'text-indigo-500' },
    { label: 'Validación', href: '/admin/eis/validation', icon: <Shield size={22} />, desc: 'Validación de respuestas IA', color: 'text-red-500' },
    { label: 'Certificados', href: '/admin/eis/certificados', icon: <Award size={22} />, desc: 'Emisión y verificación', color: 'text-amber-500' },
    { label: 'Analítica IA', href: '/admin/eis/analitica', icon: <BarChart3 size={22} />, desc: 'Panel de monitoreo completo', color: 'text-indigo-500' },
    { label: 'RAG', href: '/admin/eis/rag', icon: <Database size={22} />, desc: 'Indexación y búsqueda semántica', color: 'text-cyan-500' },
    { label: 'Recomendador', href: '/admin/eis/recomendador', icon: <Lightbulb size={22} />, desc: 'Recomendaciones inteligentes', color: 'text-violet-500' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Brain size={18} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">EIS - Environmental Intelligence Suite</h1>
          </div>
          <p className="mt-1 text-sm text-neutral-500">Suite de inteligencia ambiental: módulos avanzados del ecosistema IA</p>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Base Conocimiento" value={(kbStats?.total || 0).toLocaleString()} icon={<BookOpen size={22} />} color="text-cyan-600" />
        <StatsCard label="Especies Identificadas" value={(speciesStats?.total || 0).toLocaleString()} icon={<Camera size={22} />} color="text-blue-600" />
        <StatsCard label="Observaciones" value={(obsStats?.total || 0).toLocaleString()} icon={<Bird size={22} />} color="text-green-600" />
        <StatsCard label="Proveedores IA" value={`${providers.filter(p => p.healthy).length}/${providers.length}`} icon={<Server size={22} />} color="text-indigo-600" />
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map(m => (
          <a key={m.label} href={m.href}
            className="rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800">
            <div className={`mb-2 ${m.color}`}>{m.icon}</div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{m.label}</h3>
            <p className="mt-1 text-xs text-neutral-400">{m.desc}</p>
          </a>
        ))}
      </motion.div>

      {providers.length > 0 && (
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {providers.map((p: any) => (
            <div key={p.type} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 capitalize">{p.type}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs ${p.healthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {p.healthy ? 'Activo' : 'Caído'}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">{p.model} • Fallos: {p.failures || 0}</p>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
