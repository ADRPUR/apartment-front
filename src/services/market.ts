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
    q1_price_per_sqm: number;
    q2_price_per_sqm: number;
    q3_price_per_sqm: number;
    iqr_price_per_sqm: number;
}

export interface QuartileInterpretation {
    market_width: string;
    price_range_description: string;
    iqr_description: string;
    budget_range: string;
    affordable_range: string;
    mid_range: string;
    premium_range: string;
}

export interface SourcesBreakdown {
    proimobil: number;
    accesimobil: number;
    '999md': number;
}

export interface QuartileAnalysis {
    q1: number;
    q2: number;
    q3: number;
    iqr: number;
    total_ads: number;
    outliers_removed: number;
    outliers_percentage: number;
    interpretation: QuartileInterpretation;
    sources_breakdown: SourcesBreakdown;
}

export interface MarketSummaryResponse {
    sources: MarketStats[];
    quartile_analysis: QuartileAnalysis;
}

/**
 * Fetch aggregated market summary.
 *
 * Backend endpoint:
 *   GET /market/summary
 *
 * Returns a MarketSummaryResponse with:
 *   - sources: list of MarketStats (proimobil.md, accesimobil.md, 999.md, all)
 *   - quartile_analysis: QuartileAnalysis data
 */
export async function fetchMarketSummary(): Promise<MarketSummaryResponse> {
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
