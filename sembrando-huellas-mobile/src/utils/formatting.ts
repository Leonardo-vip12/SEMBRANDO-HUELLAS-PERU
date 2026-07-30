export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days}d`;
  return formatDateShort(dateString);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

export function formatNumber(num: number): string {
  return num.toLocaleString('es-PE');
}

export function getConservationStatusColor(status?: string): string {
  const colors: Record<string, string> = {
    'CR': '#ef4444',
    'EN': '#f97316',
    'VU': '#eab308',
    'NT': '#3b82f6',
    'LC': '#10b981',
    'DD': '#a3a3a3',
    'NE': '#a3a3a3',
  };
  return colors[status || ''] || '#a3a3a3';
}

export function getConservationStatusLabel(status?: string): string {
  const labels: Record<string, string> = {
    'CR': 'En Peligro Crítico',
    'EN': 'En Peligro',
    'VU': 'Vulnerable',
    'NT': 'Casi Amenazado',
    'LC': 'Preocupación Menor',
    'DD': 'Datos Insuficientes',
    'NE': 'No Evaluado',
  };
  return labels[status || ''] || status || 'Desconocido';
}
