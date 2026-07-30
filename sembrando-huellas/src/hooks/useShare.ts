import { useCallback } from 'react';

interface ShareData {
  title: string;
  text: string;
  url?: string;
}

export function useShare() {
  const share = useCallback(async (data: ShareData) => {
    const url = data.url || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: data.title, text: data.text, url });
        return { success: true };
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return { success: false, cancelled: true };
        }
        return { success: false, error: err };
      }
    }
    await navigator.clipboard.writeText(url);
    return { success: true, copied: true };
  }, []);

  const copyLink = useCallback(async (url?: string) => {
    const link = url || window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      return { success: true };
    } catch {
      return { success: false };
    }
  }, []);

  return { share, copyLink };
}
