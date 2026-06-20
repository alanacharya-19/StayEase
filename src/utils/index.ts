export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateTax(subtotal, rate = 0.12) {
  return subtotal * rate
}

export function calculateDiscount(subtotal, percent = 0) {
  return subtotal * (percent / 100)
}

export function calculateTotal(price, nights, taxRate = 0.12, discountPercent = 0) {
  const subtotal = price * nights
  const tax = calculateTax(subtotal, taxRate)
  const discount = calculateDiscount(subtotal, discountPercent)
  return { subtotal, tax, discount, total: subtotal + tax - discount }
}

export function formatDate(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getImageUrl(url, width = 400) {
  if (!url) return ''
  return url.replace(/w=\d+/, `w=${width}`)
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function generateId() {
  return 'ID-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}

export function truncate(str, len = 100) {
  if (!str) return ''
  return str.length > len ? str.substring(0, len) + '...' : str
}
