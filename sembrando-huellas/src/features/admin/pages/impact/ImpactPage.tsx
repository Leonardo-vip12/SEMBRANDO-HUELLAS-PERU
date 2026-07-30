import { TreePine, Users, GraduationCap, Heart } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import impactData from '@/data/json/impact.json';

export default function ImpactPage() {
  const data = impactData as any;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Impacto</h1>
        <p className="mt-1 text-sm text-neutral-500">Métricas e indicadores de impacto</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Árboles Plantados" value={(data.summary?.treesPlanted || 52000).toLocaleString()} icon={<TreePine size={22} />} trend={{ value: 12, positive: true }} />
        <StatsCard label="Voluntarios" value={(data.summary?.volunteers || 1800).toLocaleString()} icon={<Users size={22} />} trend={{ value: 8, positive: true }} />
        <StatsCard label="Estudiantes" value="30,000+" icon={<GraduationCap size={22} />} trend={{ value: 5, positive: true }} />
        <StatsCard label="Comunidades" value={data.summary?.communitiesServed || 45} icon={<Heart size={22} />} color="text-red-600" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics?.map((m: any, i: number) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{m.value}</p>
            <p className="mt-0.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">{m.label}</p>
            <p className="mt-1 text-xs text-neutral-500">{m.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Línea de Tiempo</h3>
        <div className="space-y-4">
          {data.timeline?.map((t: any, i: number) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                {t.year}
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">{t.title}</p>
                <p className="text-sm text-neutral-500">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
