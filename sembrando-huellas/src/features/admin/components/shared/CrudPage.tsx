import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from './PageHeader';
import DataTable, { type Column } from './DataTable';

interface CrudPageProps<T extends Record<string, any>> {
  title: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  basePath: string;
  onDelete?: (item: T) => void;
  onDuplicate?: (item: T) => void;
  onPreview?: (item: T) => void;
  onExport?: () => void;
  onImport?: () => void;
  searchPlaceholder?: string;
}

export default function CrudPage<T extends Record<string, any>>({
  title,
  description,
  data,
  columns,
  basePath,
  onDelete,
  onDuplicate,
  onPreview,
  onExport,
  onImport,
  searchPlaceholder,
}: CrudPageProps<T>) {
  const navigate = useNavigate();

  const handleEdit = useCallback((item: T) => {
    navigate(`${basePath}/${item.id}`);
  }, [navigate, basePath]);

  const handleAdd = useCallback(() => {
    navigate(`${basePath}/nuevo`);
  }, [navigate, basePath]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title={title}
        description={description}
        onAdd={handleAdd}
        onExport={onExport}
        onImport={onImport}
      />
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
        onEdit={handleEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onPreview={onPreview}
        searchPlaceholder={searchPlaceholder || `Buscar en ${title.toLowerCase()}...`}
      />
    </motion.div>
  );
}


