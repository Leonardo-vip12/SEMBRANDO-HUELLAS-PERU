import CrudPage from '../../components/shared/CrudPage';
import faqData from '@/data/json/faq.json';

const columns = [
  { key: 'question', label: 'Pregunta', sortable: true },
  { key: 'category', label: 'Categoría', sortable: true },
  { key: 'order', label: 'Orden' },
];

export default function FAQListPage() {
  return (
    <CrudPage
      title="Preguntas Frecuentes"
      description="Administra las preguntas frecuentes"
      data={faqData as any[]}
      columns={columns}
      basePath="/admin/faq"
    />
  );
}
