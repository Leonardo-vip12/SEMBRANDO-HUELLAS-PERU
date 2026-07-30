import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Download, FileText, BarChart3, TrendingUp, Users, Globe, RefreshCw, ExternalLink, FileSpreadsheet, FileJson, FileImage } from 'lucide-react';
import { cn } from '@/lib/cn';
import StatsCard from '@/features/admin/components/shared/StatsCard';
import { SiaService } from '../services/sia';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function SiaTransparencyPage() {
  const [loading, setLoading] = useState(true);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [impact, setImpact] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [openStats, setOpenStats] = useState<any>(null);
  const [downloads, setDownloads] = useState<any[]>([]);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [inds, projs, imp, docs, stats, dl] = await Promise.all([
        SiaService.getPublicIndicators().catch(() => []),
        SiaService.getPublicProjects().catch(() => []),
        SiaService.getImpactSummary().catch(() => null),
        SiaService.getPublicDocuments().catch(() => []),
        SiaService.getOpenStats().catch(() => null),
        SiaService.getDownloadableData().catch(() => []),
      ]);
      setIndicators(Array.isArray(inds) ? inds : inds?.data || []);
      setProjects(Array.isArray(projs) ? projs : projs?.data || []);
      setImpact(imp);
      setDocuments(Array.isArray(docs) ? docs : docs?.data || []);
      setOpenStats(stats);
      setDownloads(Array.isArray(dl) ? dl : dl?.data || []);
    } catch {}
    setLoading(false);
  }

  const formatIcon = (fmt?: string) => {
    switch (fmt?.toLowerCase()) {
      case 'csv': return <FileSpreadsheet size={16} />;
      case 'json': return <FileJson size={16} />;
      default: return <FileImage size={16} />;
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 text-white">
              <Shield size={18} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Portal de Transparencia</h1>
          </div>
          <p className="mt-1 text-sm text-neutral-500">Indicadores públicos, proyectos, impacto y datos abiertos para la ciudadanía</p>
        </div>
        <button onClick={loadAll} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Indicadores Públicos" value={indicators.length.toLocaleString()} icon={<BarChart3 size={22} />} color="text-sky-600" />
        <StatsCard label="Proyectos" value={projects.length.toLocaleString()} icon={<Users size={22} />} color="text-blue-600" />
        {impact && (
          <>
            <StatsCard label="Beneficiarios" value={(impact.beneficiaries || impact.totalBeneficiaries || 0).toLocaleString()} icon={<Users size={22} />} color="text-green-600" />
            <StatsCard label="Cobertura" value={impact.coverage || impact.coverageArea || '-'} icon={<Globe size={22} />} color="text-cyan-600" />
          </>
        )}
        {!impact && (
          <>
            <StatsCard label="Documentos" value={documents.length.toLocaleString()} icon={<FileText size={22} />} color="text-indigo-600" />
            <StatsCard label="Descargas" value={(openStats?.totalDownloads || 0).toLocaleString()} icon={<Download size={22} />} color="text-amber-600" />
          </>
        )}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Indicadores Públicos</h2>
          {indicators.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {indicators.map((ind: any, i: number) => (
                <div key={ind.id || i} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{ind.name || ind.label}</p>
                  <p className="mt-1 text-2xl font-bold text-sky-600 dark:text-sky-400">{ind.value ?? ind.currentValue ?? '-'}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
                    <TrendingUp size={12} />
                    <span>{ind.unit || ''} {ind.trend ? `${ind.trend > 0 ? '+' : ''}${ind.trend}%` : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No hay indicadores disponibles</p>
          )}
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Proyectos</h2>
          {projects.length > 0 ? (
            <div className="space-y-3">
              {projects.map((p: any, i: number) => (
                <div key={p.id || i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{p.name || p.title}</p>
                    <p className="text-xs text-neutral-400">{p.status || p.region} {p.budget ? `• ${p.budget}` : ''}</p>
                  </div>
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    p.status === 'active' || p.status === 'completado' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : p.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
                  )}>
                    {p.status || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No hay proyectos disponibles</p>
          )}
        </motion.div>
      </div>

      {impact && (
        <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-green-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Impacto</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(impact).filter(([k]) => !['id', 'updatedAt'].includes(k)).map(([key, val]) => (
              <div key={key} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
                <p className="text-xs text-neutral-400 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}</p>
                <p className="mt-1 text-xl font-bold text-neutral-900 dark:text-neutral-100">{String(val)}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Documentos Públicos</h2>
          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc: any, i: number) => (
                <div key={doc.id || i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-neutral-400" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{doc.title || doc.name}</p>
                      <p className="text-xs text-neutral-400">{doc.type || doc.category} • {doc.size || ''}</p>
                    </div>
                  </div>
                  <a href={doc.url || '#'} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    <ExternalLink size={12} /> Ver
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No hay documentos disponibles</p>
          )}
        </div>

        {openStats && (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Estadísticas Abiertas</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(openStats).filter(([k]) => !['id'].includes(k)).map(([key, val]) => (
                <div key={key} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                  <p className="text-xs text-neutral-400 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}</p>
                  <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">{String(val)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex items-center gap-2 mb-4">
          <Download size={18} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Datos Descargables</h2>
        </div>
        {downloads.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {downloads.map((d: any, i: number) => (
              <div key={d.id || i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  {formatIcon(d.format)}
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{d.name || d.title}</p>
                    <p className="text-xs text-neutral-400">{d.format?.toUpperCase()} • {d.size || ''}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300">
                  <Download size={12} /> Descargar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400">No hay datos descargables disponibles</p>
        )}
      </motion.div>
    </motion.div>
  );
}
