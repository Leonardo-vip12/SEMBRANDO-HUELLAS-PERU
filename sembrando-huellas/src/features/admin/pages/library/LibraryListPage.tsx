import CrudPage from '../../components/shared/CrudPage';
import downloadsData from '@/data/json/downloads.json';
import { Download } from 'lucide-react';

const columns = [
  { key: 'title', label: 'Recurso', sortable: true },
  { key: 'category', label: 'Categoría', sortable: true },
  { key: 'format', label: 'Formato' },
  { key: 'fileSize', label: 'Tamaño' },
  {
    key: 'downloads',
    label: 'Descargas',
    sortable: true,
    render: (item: any) => (
      <span className="flex items-center gap-1">
        <Download size={12} className="text-neutral-400" /> {item.downloads}
      </span>
    ),
  },
  {
    key: 'featured',
    label: 'Destacado',
    render: (item: any) => item.featured ? 'Sí' : 'No',
  },
];

export default function LibraryListPage() {
  return (
    <CrudPage
      title="Biblioteca Digital"
      description="Administra los recursos descargables"
      data={downloadsData as any[]}
      columns={columns}
      basePath="/admin/biblioteca"
    />
  );
}
