import CrudPage from '../../components/shared/CrudPage';
import partnersData from '@/data/json/partners.json';

const columns = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'type', label: 'Tipo', sortable: true },
  {
    key: 'active',
    label: 'Estado',
    render: (item: any) => item.active !== false ? 'Activo' : 'Inactivo',
  },
];

export default function PartnersListPage() {
  return (
    <CrudPage
      title="Aliados"
      description="Administra los aliados y合作伙伴"
      data={partnersData as any[]}
      columns={columns}
      basePath="/admin/aliados"
    />
  );
}
