export function formatCurrency(amount: number, currency = 'TWD'): string {
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency }).format(amount)
}

export function formatDate(date: string | Date, locale = 'zh-TW'): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(date))
}
