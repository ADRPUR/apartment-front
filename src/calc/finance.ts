export type Config = {
    meta?: { generated_at?: string }
    new_apartment: {
        address?: string
        price_apartment: number
        price_parking: number
        include_parking_in_calculation: boolean
        notary_country?: 'RON' | 'MDL' | 'EUR'
    }
    old_apartment: {
        address?: string
        purchase_price: number
        surface_area_sqm?: number
        market_price_per_sqm_min?: number
        market_price_per_sqm_avg?: number
        market_price_per_sqm_max?: number
        /** fallback: single market price (avg) */
        market_price_per_sqm?: number
    }
    exchange_rates: {
        eur_to_mdl: number
        eur_to_ron: number
        ron_to_mdl: number
    }
    currency_conversion?: {
        enabled?: boolean
    }
    notary_tax?: {
        enabled?: boolean
        percentage?: number
    }
    agent_fee: {
        enabled: boolean
        percentage: number
    }
    income_tax: {
        enabled: boolean
        rate: number
    }
    rental_income: {
        enabled: boolean
        monthly_amount: number
        months_lost: number
    }
}

/**
 * Result of calculation - all monetary values in EUR unless specified
 */
export interface CalculationResult {
    // Error state
    error?: string

    // Prices EUR
    salePrice: number
    agentFee: number
    tax: number
    net: number
    targetWithNotary: number
    notaryTax: number
    convCost: number
    netBeforeConv: number
    profit: number
    lostRental: number

    // Prices MDL
    saleMDL: number
    agentMDL: number
    taxMDL: number
    lostMDL: number
    netBeforeConvMDL: number
    convCostMDL: number

    // Prices RON
    saleRON: number
    notaryTaxRON: number
    netRON: number

    // Market comparisons EUR
    marketMin: number
    marketAvg: number
    marketMax: number

    // Market prices per sqm
    minMp: number
    avgMp: number
    maxMp: number
    s: number  // surface area

    // Exchange rates
    eur_to_mdl: number
    eur_to_ron: number
    ron_to_mdl: number

    // Conversion percentage
    conversionPct: number

    // Verification
    verificationDiff: number

    // KPIs
    coverPct: number
    invReturnPct: number
}

export function calculate(config: Config): CalculationResult {
    const includeParking = config.new_apartment.include_parking_in_calculation

    // 1) Target (new apartment) + notary
    const targetBase =
        (config.new_apartment.price_apartment || 0) +
        (includeParking ? config.new_apartment.price_parking || 0 : 0)

    const notaryEnabled = !!config.notary_tax?.enabled
    const notaryPct = notaryEnabled ? config.notary_tax?.percentage ?? 0 : 0
    const notaryTax = (targetBase * notaryPct) / 100
    const targetWithNotary = targetBase + notaryTax

    // 2) Old apartment + exchange
    const oldPurchase = config.old_apartment.purchase_price || 0
    const {
        eur_to_mdl = 0,
        eur_to_ron = 0,
        ron_to_mdl = 0
    } = (config.exchange_rates || {}) as any

    const s = config.old_apartment.surface_area_sqm ?? 0

    // 3) Market prices per m² (min/avg/max)
    let minMp = 0,
        avgMp = 0,
        maxMp = 0

    if (s > 0) {
        if (config.old_apartment.market_price_per_sqm_avg != null) {
            avgMp = config.old_apartment.market_price_per_sqm_avg!
            minMp = config.old_apartment.market_price_per_sqm_min || 0
            maxMp = config.old_apartment.market_price_per_sqm_max || 0
        } else if (config.old_apartment.market_price_per_sqm != null) {
            avgMp = config.old_apartment.market_price_per_sqm!
            minMp = avgMp * 0.9
            maxMp = avgMp * 1.1
        }
    }

    const marketMin = s * minMp
    const marketAvg = s * avgMp
    const marketMax = s * maxMp

    // 4) Coeficienți comision / impozit / conversie
    const agentCoef = config.agent_fee.enabled
        ? config.agent_fee.percentage / 100
        : 0

    const taxRate = config.income_tax.enabled ? config.income_tax.rate : 0
    const taxCoef = config.income_tax.enabled ? taxRate / 200 : 0

    const lostRental = config.rental_income.enabled
        ? (config.rental_income.monthly_amount || 0) *
        (config.rental_income.months_lost || 0)
        : 0

    const conversionEnabled = !!config.currency_conversion?.enabled
    const mdlNeededForRON = eur_to_ron * ron_to_mdl
    const conversionCoef =
        conversionEnabled && eur_to_mdl > 0
            ? (mdlNeededForRON - eur_to_mdl) / eur_to_mdl
            : 0

    const denom = (1 - agentCoef - taxCoef) * (1 - conversionCoef)
    if (denom <= 0) {
        // Return error state with all required fields set to 0
        return {
            error: 'Coefficients (agent/tax/convert) produce denom=0; adjust percentages.',
            salePrice: 0, agentFee: 0, tax: 0, net: 0, targetWithNotary: 0,
            notaryTax: 0, convCost: 0, netBeforeConv: 0, profit: 0, lostRental: 0,
            saleMDL: 0, agentMDL: 0, taxMDL: 0, lostMDL: 0, netBeforeConvMDL: 0,
            convCostMDL: 0, saleRON: 0, notaryTaxRON: 0, netRON: 0,
            marketMin: 0, marketAvg: 0, marketMax: 0, minMp: 0, avgMp: 0, maxMp: 0, s: 0,
            eur_to_mdl: 0, eur_to_ron: 0, ron_to_mdl: 0, conversionPct: 0,
            verificationDiff: 0, coverPct: 0, invReturnPct: 0
        }
    }

    // 5) Numerator (core formula)
    let numerator = targetWithNotary + lostRental * (1 - conversionCoef)
    if (config.income_tax.enabled) {
        numerator -= oldPurchase * taxCoef * (1 - conversionCoef)
    }

    const salePrice = numerator / denom

    // 6) Derivate
    const agentFee = salePrice * agentCoef
    const profit = salePrice - oldPurchase
    const tax =
        config.income_tax.enabled && profit > 0
            ? (profit / 2) * (taxRate / 100)
            : 0

    const netBeforeConv = salePrice - agentFee - tax - lostRental
    const convCost = conversionEnabled ? netBeforeConv * conversionCoef : 0
    const net = netBeforeConv - convCost

    // 7) Conversii valutare
    const saleMDL = salePrice * eur_to_mdl
    const saleRON = salePrice * eur_to_ron
    const agentMDL = agentFee * eur_to_mdl
    const taxMDL = tax * eur_to_mdl
    const lostMDL = lostRental * eur_to_mdl
    const netBeforeConvMDL = netBeforeConv * eur_to_mdl
    const convCostMDL = convCost * eur_to_mdl
    const notaryTaxRON = notaryTax * eur_to_ron
    const netRON = net * eur_to_ron

    // 8) KPI-uri
    const coverPct = targetWithNotary > 0 ? (net / targetWithNotary) * 100 : 0
    const invReturnPct =
        oldPurchase > 0 ? (profit / oldPurchase) * 100 : 0

    return {
        salePrice,
        saleMDL,
        saleRON,

        targetWithNotary,
        notaryTax,
        notaryTaxRON,

        marketMin,
        marketAvg,
        marketMax,
        minMp,
        avgMp,
        maxMp,
        s,

        agentFee,
        agentMDL,
        profit,
        tax,
        taxMDL,
        lostRental,
        lostMDL,

        // ATENȚIE: procent (nu fracție) – 0.9% => 0.9
        conversionPct: conversionEnabled ? conversionCoef * 100 : 0,
        convCost,
        convCostMDL,

        eur_to_mdl,
        eur_to_ron,
        ron_to_mdl,

        netBeforeConv,
        netBeforeConvMDL,
        netRON,
        net,

        verificationDiff: Math.abs(net - targetWithNotary),
        coverPct,
        invReturnPct
    }
}

export const F = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2
})
export const F4 = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4
})
export const C = (x: number) => F.format(x)
