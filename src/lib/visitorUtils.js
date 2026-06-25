const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:5050/api').replace(/\/api$/, '');

export function assetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_HOST}${path}`;
}

export function formatDateTime(date) {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function flatLabel(flat) {
  if (!flat) return '—';
  return flat.wing ? `${flat.wing}-${flat.flatNumber}` : flat.flatNumber;
}
