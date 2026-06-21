const rates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 157.5,
  INR: 83.2,
  AUD: 1.54,
  CAD: 1.37,
  SGD: 1.35,
  AED: 3.67,
  IDR: 16250,
}

const currencyNames: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  INR: 'Indian Rupee',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  SGD: 'Singapore Dollar',
  AED: 'UAE Dirham',
  IDR: 'Indonesian Rupiah',
}

export interface CurrencyRate {
  code: string
  name: string
  rate: number
}

export function getSupportedCurrencies(): CurrencyRate[] {
  return Object.entries(rates).map(([code, rate]) => ({
    code,
    name: currencyNames[code] || code,
    rate,
  }))
}

export function convertCurrency(amount: number, from: string, to: string): number {
  const inUSD = amount / (rates[from] || 1)
  return Math.round(inUSD * (rates[to] || 1) * 100) / 100
}

export function getCurrencySymbol(code: string): string {
  const symbols: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹',
    AUD: 'A$', CAD: 'C$', SGD: 'S$', AED: 'د.إ', IDR: 'Rp',
  }
  return symbols[code] || code
}
