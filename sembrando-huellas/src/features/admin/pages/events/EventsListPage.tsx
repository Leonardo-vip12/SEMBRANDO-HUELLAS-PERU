import CrudPage from '../../components/shared/CrudPage';
import StatusBadge from '../../components/shared/StatusBadge';
import eventsData from '@/data/json/events.json';

const columns = [
  { key: 'title', label: 'Título', sortable: true },
  { key: 'type', label: 'Tipo', sortable: true },
  {
    key: 'date',
    label: 'Fecha',
    sortable: true,
    render: (item: any) => new Date(item.date).toLocaleDateString('es-PE'),
  },
  { key: 'location', label: 'Ubicación', sortable: true },
  {
    key: 'status',
    label: 'Estado',
    render: (item: any) => <StatusBadge status={item.status} />,
  },
];

export default function EventsListPage() {
  return (
    <CrudPage
      title="Eventos"
      description="Administra los eventos y jornadas"
      data={eventsData as any[]}
      columns={columns}
      basePath="/admin/eventos"
    />
  );
}
