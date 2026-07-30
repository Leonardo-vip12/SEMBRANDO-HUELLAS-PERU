import CrudPage from '../../components/shared/CrudPage';
import StatusBadge from '../../components/shared/StatusBadge';
import programsData from '@/data/json/programs.json';

const columns = [
  { key: 'title', label: 'Título', sortable: true },
  { key: 'category', label: 'Categoría', sortable: true },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
    render: (item: any) => <StatusBadge status={item.status || 'active'} />,
  },
];

export default function ProgramsListPage() {
  return (
    <CrudPage
      title="Programas"
      description="Administra los programas educativos y ambientales"
      data={programsData as any[]}
      columns={columns}
      basePath="/admin/programas"
    />
  );
}
