// src/lib/currencies.ts
//
// Supported entry-fee currencies. Single source of truth shared by:
//   - the Sanity schema's currency dropdown
//     (src/sanity/schemaTypes/raceGuideType.ts)
//   - the enrichment pipeline's currency validation
//     (src/lib/raceEnrichment.ts)
// Plain module (no sanity imports) so server code can use it without
// dragging the Studio toolchain in.

export const CURRENCY_OPTIONS = [
  { title: "USD - US Dollar", value: "USD" },
  { title: "EUR - Euro", value: "EUR" },
  { title: "GBP - British Pound", value: "GBP" },
  { title: "JPY - Japanese Yen", value: "JPY" },
  { title: "AUD - Australian Dollar", value: "AUD" },
  { title: "CAD - Canadian Dollar", value: "CAD" },
  { title: "CHF - Swiss Franc", value: "CHF" },
  { title: "CNY - Chinese Yuan", value: "CNY" },
  { title: "SEK - Swedish Krona", value: "SEK" },
  { title: "DKK - Danish Krone", value: "DKK" },
  { title: "NZD - New Zealand Dollar", value: "NZD" },
  { title: "MXN - Mexican Peso", value: "MXN" },
  { title: "SGD - Singapore Dollar", value: "SGD" },
  { title: "HKD - Hong Kong Dollar", value: "HKD" },
  { title: "NOK - Norwegian Krone", value: "NOK" },
  { title: "KRW - South Korean Won", value: "KRW" },
  { title: "TRY - Turkish Lira", value: "TRY" },
  { title: "INR - Indian Rupee", value: "INR" },
  { title: "BRL - Brazilian Real", value: "BRL" },
  { title: "ZAR - South African Rand", value: "ZAR" },
  { title: "THB - Thai Baht", value: "THB" },
  { title: "QAR - Qatari Riyal", value: "QAR" },
] as const;

export const CURRENCY_CODES: ReadonlySet<string> = new Set(
  CURRENCY_OPTIONS.map((o) => o.value),
);
