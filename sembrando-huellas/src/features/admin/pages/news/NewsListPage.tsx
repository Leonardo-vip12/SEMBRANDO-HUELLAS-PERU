import CrudPage from '../../components/shared/CrudPage';
import StatusBadge from '../../components/shared/StatusBadge';
import newsData from '@/data/json/news.json';

const columns = [
  { key: 'title', label: 'Título', sortable: true },
  { key: 'category', label: 'Categoría', sortable: true },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
    render: (item: any) => <StatusBadge status={item.status || 'draft'} />,
  },
  {
    key: 'date',
    label: 'Fecha',
    sortable: true,
    render: (item: any) => new Date(item.date).toLocaleDateString('es-PE'),
  },
  { key: 'author', label: 'Autor', sortable: true },
];

export default function NewsListPage() {
  return (
    <CrudPage
      title="Noticias"
      description="Administra las noticias y artículos del sitio"
      data={newsData as any[]}
      columns={columns}
      basePath="/admin/noticias"
    />
  );
}
