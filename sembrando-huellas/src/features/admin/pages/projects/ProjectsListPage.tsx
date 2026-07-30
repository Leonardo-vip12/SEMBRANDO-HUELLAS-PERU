import CrudPage from '../../components/shared/CrudPage';
import StatusBadge from '../../components/shared/StatusBadge';
import projectsData from '@/data/json/projects.json';

const columns = [
  { key: 'title', label: 'Título', sortable: true },
  { key: 'region', label: 'Región', sortable: true },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
    render: (item: any) => <StatusBadge status={item.status || 'active'} />,
  },
  {
    key: 'budget',
    label: 'Presupuesto',
    render: (item: any) => item.budget ? `S/ ${item.budget.toLocaleString()}` : '-',
  },
];

export default function ProjectsListPage() {
  return (
    <CrudPage
      title="Proyectos"
      description="Administra los proyectos de conservación"
      data={projectsData as any[]}
      columns={columns}
      basePath="/admin/proyectos"
    />
  );
}
