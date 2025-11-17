// src/app/api/exchange-rates/route.ts

import { NextResponse } from 'next/server'

// Free API from exchangerate.host (no API key required)
const EXCHANGE_RATE_API = 'https://api.exchangerate.host/latest?base=USD'

// Cache exchange rates in memory (persists for the lifetime of the serverless function)
let cachedRates: Record<string, number> | null = null
let lastFetchTime: number = 0
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

export async function GET() {
  try {
    const now = Date.now()

    // Return cached rates if still valid
    if (cachedRates && now - lastFetchTime < CACHE_DURATION) {
      return NextResponse.json({
        rates: cachedRates,
        cached: true,
        lastUpdated: new Date(lastFetchTime).toISOString(),
      })
    }

    // Fetch fresh rates
    const response = await fetch(EXCHANGE_RATE_API)

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates')
    }

    const data = await response.json()

    if (!data.rates) {
      throw new Error('Invalid response from exchange rate API')
    }

    // Update cache
    cachedRates = data.rates
    lastFetchTime = now

    return NextResponse.json({
      rates: cachedRates,
      cached: false,
      lastUpdated: new Date(lastFetchTime).toISOString(),
    })
  } catch (error) {
    console.error('Error fetching exchange rates:', error)

    // Return fallback rates if API fails
    return NextResponse.json(
      {
        rates: getFallbackRates(),
        cached: true,
        fallback: true,
        error: 'Using fallback rates',
      },
      { status: 200 }
    )
  }
}

// Fallback rates in case API is unavailable (Last updated: January 2025)
function getFallbackRates(): Record<string, number> {
  return {
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
}
