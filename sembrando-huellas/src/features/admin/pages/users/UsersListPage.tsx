import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import PageHeader from '../../components/shared/PageHeader';

const mockUsers = Array.from({ length: 15 }, (_, i) => ({
  id: `user-${i}`,
  name: ['María José Alvarado', 'Carlos Enrique Rivas', 'Lucía Fernández', 'Roberto Huamán', 'Andrea Mendoza'][i % 5],
  email: ['maria@sembrandohuellas.org', 'carlos@sembrandohuellas.org', 'lucia@sembrandohuellas.org', 'roberto@sembrandohuellas.org', 'andrea@sembrandohuellas.org'][i % 5],
  role: ['Administrador', 'Editor', 'Redactor', 'Moderador', 'Invitado'][i % 5],
  status: ['active', 'active', 'active', 'inactive'][i % 4] as string,
  lastLogin: new Date(2025, 0, 15 - i * 2).toISOString(),
}));

const columns = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'email', label: 'Correo', sortable: true },
  { key: 'role', label: 'Rol', sortable: true },
  { key: 'status', label: 'Estado', render: (item: any) => <StatusBadge status={item.status} /> },
  { key: 'lastLogin', label: 'Último acceso', sortable: true, render: (item: any) => new Date(item.lastLogin).toLocaleDateString('es-PE') },
];

export default function UsersListPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Usuarios" description="Administra los usuarios del sistema" />
      <DataTable columns={columns} data={mockUsers} keyExtractor={(item) => item.id} />
    </div>
  );
}
