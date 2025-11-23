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
 * Fallback exchange rates (relative to USD)
 * Used when API is unavailable
 * Last updated: January 2025
 */
const FALLBACK_RATES: Record<string, number> = {
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
  THB: 35.5,
  QAR: 3.64,
}

// Cache for exchange rates (client-side only)
let cachedRates: Record<string, number> | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

/**
 * Fetch exchange rates from API or use cached/fallback rates
 * @returns Exchange rates object
 */
async function getExchangeRates(): Promise<Record<string, number>> {
  // Return cached rates if still valid
  if (cachedRates && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedRates
  }

  // Only fetch on client-side
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/exchange-rates')
      const data = await response.json()

      if (data.rates) {
        cachedRates = data.rates
        cacheTimestamp = Date.now()
        return data.rates as Record<string, number>
      }
    } catch (error) {
      console.warn('Failed to fetch exchange rates, using fallback:', error)
    }
  }

  // Use fallback rates
  return FALLBACK_RATES
}

/**
 * Convert a price from one currency to another (async version with live rates)
 * @param amount - The amount to convert
 * @param fromCurrency - The source currency code (e.g., 'EUR')
 * @param toCurrency - The target currency code (e.g., 'USD')
 * @returns The converted amount
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) return amount

  const rates = await getExchangeRates()
  const fromRate = rates[fromCurrency] || 1
  const toRate = rates[toCurrency] || 1

  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate
  return amountInUSD * toRate
}

/**
 * Convert a price from one currency to another (synchronous version with fallback rates)
 * Use this for server-side rendering or when you need immediate results
 * @param amount - The amount to convert
 * @param fromCurrency - The source currency code (e.g., 'EUR')
 * @param toCurrency - The target currency code (e.g., 'USD')
 * @returns The converted amount
 */
export function convertCurrencySync(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount

  const fromRate = FALLBACK_RATES[fromCurrency] || 1
  const toRate = FALLBACK_RATES[toCurrency] || 1

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
    THB: '฿',
    QAR: 'QR',
  }

  const symbol = currencySymbols[currency] || currency
  const roundedAmount = Math.round(amount)

  // For currencies that typically don't use decimals (JPY, KRW)
  if (['JPY', 'KRW'].includes(currency)) {
    return `${symbol}${roundedAmount.toLocaleString()}`
  }

  return `${symbol}${roundedAmount}`
}
