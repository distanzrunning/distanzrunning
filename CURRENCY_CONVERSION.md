# Currency Conversion System

## Overview

The site supports multi-currency entry prices for race guides with automatic conversion to users' preferred currencies.

## How It Works

### 1. In Sanity Studio
- Editors enter the price in the race's local currency (e.g., 120)
- Select the currency from dropdown (e.g., EUR, USD, GBP, etc.)
- 19 major currencies supported

### 2. Exchange Rate Updates
- **API**: Uses [exchangerate.host](https://exchangerate.host) (free, no API key required)
- **Update Frequency**: Weekly (7-day cache)
- **Caching**: Rates cached on server and client for 7 days
- **Fallback**: Built-in fallback rates if API unavailable

### 3. On Frontend
Two conversion functions available:

#### Async (with live rates)
```typescript
import { convertCurrency, formatPrice } from '@/lib/raceUtils'

// Convert price to user's currency
const priceInUSD = await convertCurrency(race.price, race.currency, 'USD')
const formatted = formatPrice(priceInUSD, 'USD') // "$130"
```

#### Sync (with fallback rates)
```typescript
import { convertCurrencySync, formatPrice } from '@/lib/raceUtils'

// For SSR or immediate results
const priceInUSD = convertCurrencySync(race.price, race.currency, 'USD')
const formatted = formatPrice(priceInUSD, 'USD') // "$130"
```

## Supported Currencies

- USD - US Dollar
- EUR - Euro
- GBP - British Pound
- JPY - Japanese Yen
- AUD - Australian Dollar
- CAD - Canadian Dollar
- CHF - Swiss Franc
- CNY - Chinese Yuan
- SEK - Swedish Krona
- NZD - New Zealand Dollar
- MXN - Mexican Peso
- SGD - Singapore Dollar
- HKD - Hong Kong Dollar
- NOK - Norwegian Krone
- KRW - South Korean Won
- TRY - Turkish Lira
- INR - Indian Rupee
- BRL - Brazilian Real
- ZAR - South African Rand

## API Endpoint

`GET /api/exchange-rates`

Returns:
```json
{
  "rates": {
    "EUR": 0.92,
    "GBP": 0.79,
    ...
  },
  "cached": true,
  "lastUpdated": "2025-01-17T10:30:00.000Z"
}
```

## Performance

- **Server-side cache**: 7 days (in serverless function memory)
- **Client-side cache**: 7 days (in browser memory)
- **Fallback rates**: Always available if API fails
- **Zero API keys**: No authentication required

## Future Enhancements

1. User currency preference stored in localStorage/cookies
2. Automatic IP-based currency detection
3. Real-time rate updates (shorter cache duration)
4. Support for more currencies
