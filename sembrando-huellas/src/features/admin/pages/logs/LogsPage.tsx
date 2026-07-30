import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';

const mockLogs = Array.from({ length: 50 }, (_, i) => ({
  id: `log-${i}`,
  action: ['Creación', 'Edición', 'Eliminación', 'Publicación', 'Archivado', 'Inicio de sesión', 'Error'][i % 7],
  entity: ['Noticia', 'Proyecto', 'Especie', 'Evento', 'Usuario', 'Galería'][i % 6],
  user: ['Admin', 'Editor', 'Redactor'][i % 3],
  description: [
    'Se creó una nueva noticia',
    'Se actualizó el proyecto "Corredor Biológico"',
    'Se eliminó una especie',
    'Se publicó un artículo',
    'Se inició sesión desde IP 192.168.1.1',
    'Error al procesar imagen: formato no soportado',
  ][i % 6],
  timestamp: new Date(2025, 5, 1 + i, 10 + (i % 8), (i * 13) % 60).toISOString(),
  severity: ['info', 'info', 'info', 'warning', 'error'][i % 5],
}));

const columns = [
  { key: 'action', label: 'Acción', sortable: true },
  { key: 'entity', label: 'Entidad', sortable: true },
  { key: 'user', label: 'Usuario', sortable: true },
  { key: 'description', label: 'Descripción' },
  {
    key: 'timestamp',
    label: 'Fecha',
    sortable: true,
    render: (item: any) => new Date(item.timestamp).toLocaleString('es-PE'),
  },
  {
    key: 'severity',
    label: 'Severidad',
    render: (item: any) => <StatusBadge status={item.severity === 'error' ? 'archived' : item.severity === 'warning' ? 'pending' : 'published'} customLabel={item.severity} />,
  },
];

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Registro de Auditoría</h1>
        <p className="mt-1 text-sm text-neutral-500">Historial de acciones realizadas en el sistema</p>
      </div>
      <DataTable columns={columns} data={mockLogs} keyExtractor={(item) => item.id} pageSize={15} />
    </div>
  );
}
