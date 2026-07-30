import DataTable from '../../components/shared/DataTable';
import PageHeader from '../../components/shared/PageHeader';

const mockCategories = [
  { id: 'cat-1', name: 'Reforestación', type: 'Noticias', count: 8, color: 'Verde' },
  { id: 'cat-2', name: 'Educación', type: 'Noticias', count: 6, color: 'Azul' },
  { id: 'cat-3', name: 'Investigación', type: 'Proyectos', count: 4, color: 'Amarillo' },
  { id: 'cat-4', name: 'Comunidad', type: 'Noticias', count: 5, color: 'Rojo' },
  { id: 'cat-5', name: 'Mamíferos', type: 'Especies', count: 3, color: 'Naranja' },
  { id: 'cat-6', name: 'Aves', type: 'Especies', count: 2, color: 'Celeste' },
  { id: 'cat-7', name: 'Eventos', type: 'Calendario', count: 4, color: 'Púrpura' },
];

const columns = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'type', label: 'Tipo', sortable: true },
  { key: 'count', label: 'Contenidos', sortable: true },
  { key: 'color', label: 'Color' },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Categorías" description="Administra las categorías del contenido" />
      <DataTable columns={columns} data={mockCategories} keyExtractor={(item) => item.id} />
    </div>
  );
}
