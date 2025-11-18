import { fetchMarketSummary, type MarketSummaryResponse } from '../services/market'
import { useApi } from './useApi'
import { CACHE_CONFIG } from '../constants'

/**
 * Custom hook for fetching market data with caching and deduplication
 * This ensures market data is only fetched once and shared across components
 */
export function useMarketData() {
  return useApi<MarketSummaryResponse>(
    fetchMarketSummary,
    [], // Only fetch once on mount
    {
      cacheKey: 'market-summary',
      cacheTTL: CACHE_CONFIG.MARKET_DATA_TTL,
    }
  )
}

/**
 * Get specific market source data from the summary
 */
export function useMarketSource(source: string) {
  const { data, loading, error, refetch } = useMarketData()

  const sourceData = data?.sources?.find((s) => s.source === source) ?? null

  return { data: sourceData, loading, error, refetch }
}

/**
 * Get aggregated market data (source = "all")
 */
export function useAggregatedMarketData() {
  return useMarketSource('all')
}

