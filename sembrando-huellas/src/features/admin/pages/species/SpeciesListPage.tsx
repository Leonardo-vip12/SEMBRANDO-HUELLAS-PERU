import CrudPage from '../../components/shared/CrudPage';
import StatusBadge from '../../components/shared/StatusBadge';
import speciesData from '@/data/json/species.json';

const statusMap: Record<string, string> = {
  endangered: 'En peligro',
  vulnerable: 'Vulnerable',
  'near threatened': 'Casi amenazado',
  'least concern': 'Preocupación menor',
  'critically endangered': 'Peligro crítico',
};

const columns = [
  { key: 'name', label: 'Nombre Común', sortable: true },
  { key: 'scientificName', label: 'Nombre Científico', sortable: true },
  { key: 'category', label: 'Categoría', sortable: true },
  {
    key: 'conservationStatus',
    label: 'Estado',
    render: (item: any) => <StatusBadge status={item.conservationStatus === 'endangered' ? 'active' : 'pending'} customLabel={statusMap[item.conservationStatus] || item.conservationStatus} />,
  },
  { key: 'region', label: 'Región', sortable: true },
];

export default function SpeciesListPage() {
  return (
    <CrudPage
      title="Especies"
      description="Administra las especies monitoreadas"
      data={speciesData as any[]}
      columns={columns}
      basePath="/admin/especies"
    />
  );
}
