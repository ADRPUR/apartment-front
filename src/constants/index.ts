// Central configuration and constants

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE?.replace(/\/+$/, '') || 'http://localhost:8000',
  ENDPOINTS: {
    MARKET_SUMMARY: '/market/summary',
    EXCHANGE_RATES: '/rates',
    PDF_EXPORT: '/pdf',
    SALE_PDF_EXPORT: '/pdf/sale',
  },
  TIMEOUT: 10000, // 10 seconds
} as const

/**
 * Currency symbols and formats
 */
export const CURRENCY = {
  EUR: '€',
  RON: 'RON',
  MDL: 'MDL',
} as const

/**
 * Number formatting defaults
 */
export const NUMBER_FORMAT = {
  LOCALE: 'ro-RO',
  DECIMAL_PLACES: 2,
  MAX_FRACTION_DIGITS: 2,
} as const

/**
 * Color palettes (Okabe-Ito color-blind friendly)
 */
export const COLORS = {
  CHART: ['#0072B2', '#E69F00', '#009E73', '#CC79A7', '#D55E00'],
  STATUS: {
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#3b82f6',
  },
} as const

/**
 * Market data sources
 */
export const MARKET_SOURCES = {
  PROIMOBIL: 'proimobil.md',
  ACCESIMOBIL: 'accesimobil.md',
  ALL: 'all',
} as const

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  MARKET_DATA_TTL: 1000 * 60 * 30, // 30 minutes
  EXCHANGE_RATES_TTL: 1000 * 60 * 60 * 24, // 24 hours
} as const

/**
 * Animation durations (ms)
 */
export const ANIMATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
} as const

