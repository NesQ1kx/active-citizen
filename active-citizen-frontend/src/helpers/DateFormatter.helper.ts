export function DateFormatter(date: number) {
  return new Date(date).toLocaleString('ru', { year: 'numeric', month: '2-digit', day: '2-digit' })
}