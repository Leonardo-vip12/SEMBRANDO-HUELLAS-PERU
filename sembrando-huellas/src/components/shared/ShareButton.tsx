import { useState, useCallback } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useShare } from '@/hooks/useShare';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ShareButton({ title, text, url, className, size = 'md', showLabel }: ShareButtonProps) {
  const { share, copyLink } = useShare();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const sizeMap = { sm: 16, md: 20, lg: 24 };
  const iconSize = sizeMap[size];

  const handleShare = useCallback(async () => {
    const result = await share({ title, text, url });
    if (result.copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    if (result.success && !result.copied) {
      setShared(true);
    }
  }, [share, title, text, url]);

  const handleCopy = useCallback(async () => {
    const result = await copyLink(url);
    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copyLink, url]);

  return (
    <div className="inline-flex items-center gap-1">
      <button
        onClick={handleShare}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg p-2 transition-all duration-200',
          'text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
          className,
        )}
        aria-label="Compartir"
      >
        {shared ? <Check size={iconSize} className="text-green-500" /> : <Share2 size={iconSize} />}
        {showLabel && <span className="text-xs">{shared ? 'Compartido' : 'Compartir'}</span>}
      </button>
      <button
        onClick={handleCopy}
        className="rounded-lg p-2 text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
        aria-label="Copiar enlace"
      >
        {copied ? <Check size={iconSize} className="text-green-500" /> : <Copy size={iconSize} />}
      </button>
    </div>
  );
}
