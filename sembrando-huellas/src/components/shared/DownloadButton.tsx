import { Download } from 'lucide-react';
import { cn } from '@/lib/cn';
import { LibraryService } from '@/services/library';

interface DownloadButtonProps {
  resourceId: string;
  fileUrl: string;
  label?: string;
  className?: string;
}

export default function DownloadButton({ resourceId, fileUrl, label = 'Descargar', className }: DownloadButtonProps) {
  const handleDownload = () => {
    LibraryService.incrementDownloads(resourceId);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || 'download';
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium',
        'bg-primary-600 text-white hover:bg-primary-700',
        'transition-all duration-200 active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      aria-label={label}
    >
      <Download size={16} />
      {label}
    </button>
  );
}
