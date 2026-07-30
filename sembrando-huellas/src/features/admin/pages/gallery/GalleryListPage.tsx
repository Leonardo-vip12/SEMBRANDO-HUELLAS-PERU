import CrudPage from '../../components/shared/CrudPage';
import galleryData from '@/data/json/gallery.json';

const columns = [
  {
    key: 'title',
    label: 'Álbum',
    sortable: true,
    render: (item: any) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-neutral-100 dark:bg-neutral-700" />
        <span>{item.title}</span>
      </div>
    ),
  },
  { key: 'images', label: 'Fotos', render: (item: any) => item.images?.length || 0 },
  { key: 'date', label: 'Fecha', sortable: true, render: (item: any) => new Date(item.date).toLocaleDateString('es-PE') },
  {
    key: 'featured',
    label: 'Destacado',
    render: (item: any) => item.featured ? 'Sí' : 'No',
  },
];

export default function GalleryListPage() {
  return (
    <CrudPage
      title="Galería"
      description="Administra los álbumes de fotos"
      data={galleryData as any[]}
      columns={columns}
      basePath="/admin/galeria"
    />
  );
}
