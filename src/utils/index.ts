export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateTax(subtotal: number, rate = 0.12): number {
  return subtotal * rate
}

export function calculateDiscount(subtotal: number, percent = 0): number {
  return subtotal * (percent / 100)
}

export function calculateTotal(
  price: number,
  nights: number,
  taxRate = 0.12,
  discountPercent = 0
): { subtotal: number; tax: number; discount: number; total: number } {
  const subtotal = price * nights
  const tax = calculateTax(subtotal, taxRate)
  const discount = calculateDiscount(subtotal, discountPercent)
  return { subtotal, tax, discount, total: subtotal + tax - discount }
}

export function formatDate(dateString: string): string {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getImageUrl(url: string, width = 400): string {
  if (!url) return ''
  return url.replace(/w=\d+/, `w=${width}`)
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function generateId(): string {
  return 'ID-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}

export function truncate(str: string, len = 100): string {
  if (!str) return ''
  return str.length > len ? str.substring(0, len) + '...' : str
}
