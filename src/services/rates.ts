// src/services/rates.ts
import { API_CONFIG } from '../constants'
import type { Config } from '../calc/finance'

export interface RatesResponse {
    date: string;
    eur_to_mdl: number;
    eur_to_mdl_label: string;
    eur_to_ron: number;
    eur_to_ron_label: string;
    ron_to_mdl: number;
    ron_to_mdl_label: string;
}

/**
 * Call the local FastAPI backend and get the rates:
 * - EUR→MDL (BNM)
 * - EUR→RON (BNR)
 * - RON→MDL (BNM or cross-rate)
 */
export async function fetchRates(): Promise<RatesResponse> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EXCHANGE_RATES}`

    const resp = await fetch(url, {
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`)
    }

    return resp.json()
}
