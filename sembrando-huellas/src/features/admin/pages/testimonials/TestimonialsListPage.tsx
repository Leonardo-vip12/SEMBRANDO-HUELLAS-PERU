import CrudPage from '../../components/shared/CrudPage';
import testimonialsData from '@/data/json/testimonials.json';

const columns = [
  { key: 'author', label: 'Autor', sortable: true },
  { key: 'role', label: 'Cargo', sortable: true },
  { key: 'quote', label: 'Testimonio', render: (item: any) => item.quote?.slice(0, 80) + '...' },
];

export default function TestimonialsListPage() {
  return (
    <CrudPage
      title="Testimonios"
      description="Administra los testimonios"
      data={testimonialsData as any[]}
      columns={columns}
      basePath="/admin/testimonios"
    />
  );
}
