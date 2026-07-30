import { DollarSign, TrendingUp, Users, Repeat } from 'lucide-react';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import StatsCard from '../../components/shared/StatsCard';

const mockDonations = Array.from({ length: 20 }, (_, i) => ({
  id: `don-${i}`,
  donor: ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Pedro Sánchez'][i % 5],
  amount: Math.floor(Math.random() * 5000) + 50,
  date: new Date(2025, 0, 1 + i * 7).toISOString().split('T')[0],
  method: ['Yape', 'Plin', 'Transferencia', 'PayPal', 'Tarjeta'][i % 5],
  status: ['completed', 'completed', 'completed', 'pending'][i % 4],
}));

const columns = [
  { key: 'donor', label: 'Donante', sortable: true },
  { key: 'amount', label: 'Monto', sortable: true, render: (item: any) => `S/ ${item.amount.toLocaleString()}` },
  { key: 'date', label: 'Fecha', sortable: true, render: (item: any) => new Date(item.date).toLocaleDateString('es-PE') },
  { key: 'method', label: 'Método', sortable: true },
  { key: 'status', label: 'Estado', render: (item: any) => <StatusBadge status={item.status} /> },
];

export default function DonationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Donaciones</h1>
        <p className="mt-1 text-sm text-neutral-500">Administra las donaciones recibidas</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Recaudado" value="S/ 128,500" icon={<DollarSign size={22} />} trend={{ value: 15, positive: true }} />
        <StatsCard label="Donaciones del Mes" value="S/ 12,400" icon={<TrendingUp size={22} />} trend={{ value: 8, positive: true }} />
        <StatsCard label="Donantes Activos" value="156" icon={<Users size={22} />} color="text-blue-600" />
        <StatsCard label="Donaciones Recurrentes" value="42" icon={<Repeat size={22} />} color="text-purple-600" />
      </div>
      <DataTable columns={columns} data={mockDonations} keyExtractor={(item) => item.id} />
    </div>
  );
}
