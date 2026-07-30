import CrudPage from '../../components/shared/CrudPage';
import teamData from '@/data/json/team.json';

const columns = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'role', label: 'Cargo', sortable: true },
];

export default function TeamListPage() {
  return (
    <CrudPage
      title="Equipo"
      description="Administra los miembros del equipo"
      data={teamData as any[]}
      columns={columns}
      basePath="/admin/equipo"
    />
  );
}
