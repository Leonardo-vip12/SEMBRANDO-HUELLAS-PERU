import CrudPage from '../../components/shared/CrudPage';
import volunteersData from '@/data/json/volunteers.json';

const columns = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'email', label: 'Correo', sortable: true },
  { key: 'region', label: 'Región', sortable: true },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
  },
  {
    key: 'registeredAt',
    label: 'Registro',
    sortable: true,
    render: (item: any) => new Date(item.registeredAt).toLocaleDateString('es-PE'),
  },
];

export default function VolunteersListPage() {
  return (
    <CrudPage
      title="Voluntarios"
      description="Administra los voluntarios registrados"
      data={volunteersData as any[]}
      columns={columns}
      basePath="/admin/voluntarios"
    />
  );
}
