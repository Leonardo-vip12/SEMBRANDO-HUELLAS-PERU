import { TreePine, Users, GraduationCap, Heart, TrendingUp } from 'lucide-react';
import CardBase from '@/components/cards/CardBase';
import { cn } from '@/lib/cn';

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface BarItem {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

const stats: StatCard[] = [
  { label: 'Árboles Plantados', value: '52,000+', icon: <TreePine size={24} />, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  { label: 'Voluntarios', value: '1,800+', icon: <Users size={24} />, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { label: 'Estudiantes', value: '30,000+', icon: <GraduationCap size={24} />, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  { label: 'Comunidades', value: '45', icon: <Heart size={24} />, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
];

const yearlyData: BarItem[] = [
  { label: '2021', value: 8000, maxValue: 52000, color: '#22C55E' },
  { label: '2022', value: 15000, maxValue: 52000, color: '#16A34A' },
  { label: '2023', value: 12000, maxValue: 52000, color: '#15803D' },
  { label: '2024', value: 17000, maxValue: 52000, color: '#166534' },
];

const categoryData: BarItem[] = [
  { label: 'Reforestación', value: 40, maxValue: 100, color: '#3B82F6' },
  { label: 'Educación', value: 30, maxValue: 100, color: '#8B5CF6' },
  { label: 'Investigación', value: 20, maxValue: 100, color: '#F59E0B' },
  { label: 'Comunitario', value: 10, maxValue: 100, color: '#EF4444' },
];

export default function ImpactDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <CardBase key={stat.label} variant="default" padding="md">
            <div className="flex items-center gap-4">
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', stat.bgColor, stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            </div>
          </CardBase>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CardBase variant="default" padding="lg">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-500" />
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Árboles Plantados por Año</h3>
          </div>
          <div className="space-y-4">
            {yearlyData.map((bar) => (
              <div key={bar.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">{bar.label}</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">{bar.value.toLocaleString()}</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-100 dark:bg-neutral-700">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(bar.value / bar.maxValue) * 100}%`, backgroundColor: bar.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBase>

        <CardBase variant="default" padding="lg">
          <div className="mb-4 flex items-center gap-2">
            <Heart size={18} className="text-purple-500" />
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Distribución por Área</h3>
          </div>
          <div className="space-y-4">
            {categoryData.map((bar) => (
              <div key={bar.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">{bar.label}</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">{bar.value}%</span>
                </div>
                <div className="h-4 rounded-full bg-neutral-100 dark:bg-neutral-700">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${bar.value}%`, backgroundColor: bar.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBase>
      </div>

      <CardBase variant="default" padding="lg">
        <div className="mb-4 flex items-center gap-2">
          <TreePine size={18} className="text-emerald-500" />
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Resumen de Impacto</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Hectáreas Restauradas', value: '380', unit: 'ha' },
            { label: 'Especies Protegidas', value: '240', unit: 'especies' },
            { label: 'Actividades Realizadas', value: '250+', unit: 'actividades' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-neutral-800">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{item.value}</p>
              <p className="mt-1 text-xs text-neutral-500">{item.label}</p>
            </div>
          ))}
        </div>
      </CardBase>
    </div>
  );
}
