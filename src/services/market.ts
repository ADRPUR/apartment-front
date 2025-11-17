// src/services/market.ts
import { API_CONFIG } from '../constants'

export interface PriceHistogramBin {
    start: number;
    end: number | null;
    count: number;
    percentage: number;
    label: string;
}

export interface MarketStats {
    source: string;              // "proimobil.md", "accesimobil.md", "all"
    url: string | null;          // listing URL for the source; null for "all"
    total_ads: number;
    min_price_per_sqm: number;
    max_price_per_sqm: number;
    avg_price_per_sqm: number;
    median_price_per_sqm: number;
    price_histogram: PriceHistogramBin[] | null;
    dominant_range: string | null;
    dominant_percentage: number | null;
}

/**
 * Fetch aggregated market summary.
 *
 * Backend endpoint:
 *   GET /market/summary
 *
 * Returns a list of MarketStats:
 *   - proimobil.md
 *   - accesimobil.md
 *   - all (aggregate)
 */
export async function fetchMarketSummary(): Promise<MarketStats[]> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MARKET_SUMMARY}`

    const resp = await fetch(url, {
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    if (!resp.ok) {
        throw new Error(
            `Failed to load market summary: HTTP ${resp.status}`
        )
    }

    return resp.json()
}
