// src/lib/raceUtils.ts

/**
 * Calculate net elevation from elevation gain and loss
 * @param elevationGain - Elevation gain in meters
 * @param elevationLoss - Elevation loss in meters
 * @returns Net elevation (absolute value of gain - loss)
 */
export function calculateNetElevation(
  elevationGain: number = 0,
  elevationLoss: number = 0
): number {
  return Math.abs(elevationGain - elevationLoss)
}

/**
 * Approximate exchange rates (relative to USD)
 * These should ideally be fetched from an API, but this provides a fallback
 * Last updated: January 2025
 */
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  AUD: 1.58,
  CAD: 1.43,
  CHF: 0.88,
  CNY: 7.25,
  SEK: 10.6,
  NZD: 1.71,
  MXN: 17.2,
  SGD: 1.34,
  HKD: 7.8,
  NOK: 10.9,
  KRW: 1420,
  TRY: 34.5,
  INR: 83.5,
  BRL: 5.9,
  ZAR: 18.5,
}

/**
 * Convert a price from one currency to another
 * @param amount - The amount to convert
 * @param fromCurrency - The source currency code (e.g., 'EUR')
 * @param toCurrency - The target currency code (e.g., 'USD')
 * @returns The converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount

  const fromRate = EXCHANGE_RATES[fromCurrency] || 1
  const toRate = EXCHANGE_RATES[toCurrency] || 1

  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate
  return amountInUSD * toRate
}

/**
 * Format a price with currency symbol
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., 'USD')
 * @returns Formatted price string (e.g., '$150' or '€120')
 */
export function formatPrice(amount: number, currency: string): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    CNY: '¥',
    SEK: 'kr',
    NZD: 'NZ$',
    MXN: 'MX$',
    SGD: 'S$',
    HKD: 'HK$',
    NOK: 'kr',
    KRW: '₩',
    TRY: '₺',
    INR: '₹',
    BRL: 'R$',
    ZAR: 'R',
  }

  const symbol = currencySymbols[currency] || currency
  const roundedAmount = Math.round(amount)

  // For currencies that typically don't use decimals (JPY, KRW)
  if (['JPY', 'KRW'].includes(currency)) {
    return `${symbol}${roundedAmount.toLocaleString()}`
  }

  return `${symbol}${roundedAmount}`
}
