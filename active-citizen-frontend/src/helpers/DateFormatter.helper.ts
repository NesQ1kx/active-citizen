export function DateFormatter(date: number, withTime = false) {
  return withTime
  ? new Date(date).toLocaleString('ru', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  : new Date(date).toLocaleString('ru', { year: 'numeric', month: '2-digit', day: '2-digit' });
}