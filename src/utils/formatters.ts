import { CURRENCY, NUMBER_FORMAT } from '../constants'

/**
 * Format number with thousand separators and decimal places
 */
export function formatNumber(
  value: number | null | undefined,
  decimals: number = NUMBER_FORMAT.DECIMAL_PLACES
): string {
  if (value == null || Number.isNaN(value)) return '–'

  return value.toLocaleString(NUMBER_FORMAT.LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format currency with symbol (enhanced version of C function)
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: 'EUR' | 'RON' | 'MDL' = 'EUR',
  decimals: number = NUMBER_FORMAT.DECIMAL_PLACES
): string {
  if (value == null || Number.isNaN(value)) return '–'

  const formatted = formatNumber(value, decimals)

  switch (currency) {
    case 'EUR':
      return `${CURRENCY.EUR} ${formatted}`
    case 'RON':
      return `${formatted} ${CURRENCY.RON}`
    case 'MDL':
      return `${formatted} ${CURRENCY.MDL}`
    default:
      return formatted
  }
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals: number = 2
): string {
  if (value == null || Number.isNaN(value)) return '–'
  return `${formatNumber(value, decimals)}%`
}

/**
 * Format EUR to RON with label
 */
export function formatEurToRon(eur: number, rate: number): string {
  const ron = eur * rate
  return formatCurrency(ron, 'RON')
}

/**
 * Format EUR to MDL with label
 */
export function formatEurToMdl(eur: number, rate: number): string {
  const mdl = eur * rate
  return formatCurrency(mdl, 'MDL')
}

/**
 * Compact number format (legacy C function for backward compatibility)
 */
export function C(val: number, decimals = 2): string {
  if (val == null || Number.isNaN(val)) return '0'
  return val.toLocaleString(NUMBER_FORMAT.LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format price per square meter
 */
export function formatPricePerSqm(
  pricePerSqm: number | null | undefined,
  currency: 'EUR' | 'RON' | 'MDL' = 'EUR'
): string {
  if (pricePerSqm == null || Number.isNaN(pricePerSqm)) return '–'
  return `${formatCurrency(pricePerSqm, currency)}/m²`
}

