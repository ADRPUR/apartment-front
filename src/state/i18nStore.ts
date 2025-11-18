import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Lang = 'en' | 'ro'

const D: Record<Lang, Record<string, string>> = {
    en: {
        'kpi.minRequired': 'Minimum required price',
        'kpi.profit': 'Profit %',
        'kpi.cover': 'Cover %',
        'btn.dark': 'Dark',
        'title.report': 'Apartment Sale Price Report',
        'gen.on': 'Generated on',

        'section.config': 'Configuration (live)',
        'section.market': 'Market analysis - Price range',
        'section.exchange': 'Exchange rates',
        'section.agent': 'Agent fee',
        'section.tax': 'Income tax',
        'section.rent': 'Lost rent',
        'section.conv': 'Currency conversion',
        'section.costs': 'Costs & Taxes',
        'section.verify': 'Verification',

        'card.new': 'New apartment',
        'card.new.sub': 'Target to cover (EUR/RON)',
        'card.old': 'Old apartment',
        'card.old.sub': 'Your current asset to be sold',
        'label.address': 'Address',
        'label.apartmentPrice': 'Apartment price',
        'label.parkingPrice': 'Parking price',
        'label.includeParking': 'Include parking in calculation',
        'label.notaryCountry': 'Notary country',
        'label.notaryPct': 'Notary (%)',
        'label.purchasePrice': 'Purchase price',
        'label.surface': 'Surface',
        'label.sqm': 'm²',
        'label.perSqmMin': '€/m² (min)',
        'label.perSqmAvg': '€/m² (avg)',
        'label.perSqmMax': '€/m² (max)',
        'label.notaryEnabled': 'Notary fee enabled',
        'label.eurMdl': 'EUR → MDL',
        'label.eurRon': 'EUR → RON',
        'label.ronMdl': 'RON → MDL',
        'btn.autoRates': 'Auto rates (API)',
        'help.parking': 'Included only if the checkbox below is ON.',
        'help.incomeTax': 'Applied on 50% of profit (per current formula).',
        'label.agentPct': 'Agent (%)',
        'label.enabled': 'Enabled',
        'label.incomeTaxPct': 'Income tax (%)',
        'label.rentPerMonth': 'Rent / month',
        'label.monthsLost': 'Months lost',
        'help.conv':
            'Uses the gap between EUR→MDL and EUR→RON→MDL to estimate conversion cost.',
        'btn.reset': 'Reset',
        'btn.export': 'Export JSON',
        'btn.import': 'Import JSON',
        'help.manualRate':
            'Click Auto Rates to load official exchange rates or enter values manually.',

        // market.*
        'market.title': 'Market analysis',
        'market.subtitle': 'Indicative price per m² for similar apartments',
        'market.disclaimer':
            'Data is fetched automatically from the listed websites and may differ from actual prices.',
        'market.loading': 'Loading…',
        'market.error': 'Error',
        'market.errorDetails': 'Unable to load data',
        'market.total': 'Number of listings',
        'market.minPriceSqm': 'Min price / m²',
        'market.maxPriceSqm': 'Max price / m²',
        'market.avgPriceSqm': 'Average price / m²',
        'market.medianPriceSqm': 'Median price / m²',
        'market.quartileData': 'Quartile Data',
        'market.q1Short': 'Budget',
        'market.q2Short': 'Median',
        'market.q3Short': 'Premium',
        'market.iqrShort': 'Range',

        // Quartile analysis
        'quartile.title': 'Quartile Analysis',
        'quartile.badge': 'Advanced',
        'quartile.description':
            'Statistical analysis that eliminates extreme outliers to show the realistic price distribution.',
        'quartile.q1Label': 'Budget Range',
        'quartile.q2Label': 'Median (Q2)',
        'quartile.q3Label': 'Premium Range',
        'quartile.iqrLabel': 'Interquartile Range',
        'quartile.marketWidth': 'Market width',
        'quartile.priceRanges': 'Price Range Categories',
        'quartile.budgetRange': 'Budget',
        'quartile.affordableRange': 'Affordable',
        'quartile.midRange': 'Mid-range',
        'quartile.premiumRange': 'Premium',
        'quartile.outliersRemoved': 'Outliers removed',
        'quartile.ads': 'ads',
        'quartile.interpretation': 'Interpretation',
        'quartile.medianDescription': 'Middle point of the market',

        // new keys
        'market.allLabel': 'All platforms',
        'market.openSiteHint':
            'Click on the title to open the listing page in a new tab.',
        'market.summaryHint': 'Aggregated statistics for all platforms.',
        'market.noData': 'No data available.'
    },
    ro: {
        'kpi.minRequired': 'Preț minim necesar',
        'kpi.profit': 'Profit %',
        'kpi.cover': 'Acoperire %',
        'btn.dark': 'Întunecat',
        'title.report': 'Raport preț vânzare apartament',
        'gen.on': 'Generat la',

        'section.config': 'Configurare (live)',
        'section.market': 'Analiză piață - Interval preț',
        'section.exchange': 'Cursuri valutare',
        'section.agent': 'Comision agent',
        'section.tax': 'Impozit venit',
        'section.rent': 'Chirie pierdută',
        'section.conv': 'Cost conversie valută',
        'section.costs': 'Costuri & taxe',
        'section.verify': 'Verificare',

        'card.new': 'Apartament nou',
        'card.new.sub': 'Ținta de acoperit (EUR/RON)',
        'card.old': 'Apartament vechi',
        'card.old.sub': 'Activul curent pentru vânzare',
        'label.address': 'Adresă',
        'label.apartmentPrice': 'Preț apartament',
        'label.parkingPrice': 'Preț parcare',
        'label.includeParking': 'Include parcarea în calcul',
        'label.notaryCountry': 'Țara notarului',
        'label.notaryPct': 'Notar (%)',
        'label.purchasePrice': 'Preț achiziție',
        'label.surface': 'Suprafață',
        'label.sqm': 'm²',
        'label.perSqmMin': '€/m² (min)',
        'label.perSqmAvg': '€/m² (med)',
        'label.perSqmMax': '€/m² (max)',
        'label.notaryEnabled': 'Taxă notar activă',
        'label.eurMdl': 'EUR → MDL',
        'label.eurRon': 'EUR → RON',
        'label.ronMdl': 'RON → MDL',
        'btn.autoRates': 'Rate auto (API)',
        'help.parking': 'Inclus doar dacă bifa de mai jos este activă.',
        'help.incomeTax':
            'Aplicat pe 50% din profit (conform formulei curente).',
        'label.agentPct': 'Agent (%)',
        'label.enabled': 'Activ',
        'label.incomeTaxPct': 'Impozit venit (%)',
        'label.rentPerMonth': 'Chirie / lună',
        'label.monthsLost': 'Luni pierdute',
        'help.conv':
            'Folosește diferența EUR→MDL vs EUR→RON→MDL pentru a estima costul conversiei.',
        'btn.reset': 'Reset',
        'btn.export': 'Export JSON',
        'btn.import': 'Import JSON',
        'help.manualRate':
            'Apasă pe „Rate auto (API)” pentru a încărca cursurile oficiale sau introdu valorile manual.',

        // market.*
        'market.title': 'Analiză piață',
        'market.subtitle': 'Preț orientativ pe m² pentru apartamente similare',
        'market.disclaimer':
            'Datele sunt preluate automat de pe site-urile listate și pot avea abateri față de prețurile reale.',
        'market.loading': 'Se încarcă…',
        'market.error': 'Eroare',
        'market.errorDetails': 'Nu s-au putut încărca datele',
        'market.total': 'Număr anunțuri',
        'market.minPriceSqm': 'Preț minim / m²',
        'market.maxPriceSqm': 'Preț maxim / m²',
        'market.avgPriceSqm': 'Preț mediu / m²',
        'market.medianPriceSqm': 'Mediană / m²',
        'market.quartileData': 'Date Quartile',
        'market.q1Short': 'Buget',
        'market.q2Short': 'Mediană',
        'market.q3Short': 'Premium',
        'market.iqrShort': 'Interval',

        // Analiza quartilă
        'quartile.title': 'Analiză Quartilă',
        'quartile.badge': 'Avansat',
        'quartile.description':
            'Analiză statistică care elimină valorile extreme pentru a arăta distribuția realistă a prețurilor.',
        'quartile.q1Label': 'Zona Buget',
        'quartile.q2Label': 'Mediană (Q2)',
        'quartile.q3Label': 'Zona Premium',
        'quartile.iqrLabel': 'Interval Intercuartilic',
        'quartile.marketWidth': 'Lățime piață',
        'quartile.priceRanges': 'Categorii Interval Preț',
        'quartile.budgetRange': 'Buget',
        'quartile.affordableRange': 'Accesibil',
        'quartile.midRange': 'Mediu',
        'quartile.premiumRange': 'Premium',
        'quartile.outliersRemoved': 'Valori extreme eliminate',
        'quartile.ads': 'anunțuri',
        'quartile.interpretation': 'Interpretare',
        'quartile.medianDescription': 'Punctul median al pieței',

        // chei noi
        'market.allLabel': 'Toate platformele',
        'market.openSiteHint':
            'Apasă pe titlu pentru a deschide în tab nou lista de anunțuri.',
        'market.summaryHint': 'Statistici agregate pentru toate platformele.',
        'market.noData': 'Nu există date disponibile.'
    }
}

type I18nStore = { lang: Lang; setLang: (l: Lang) => void }

export const useI18n = create<I18nStore>()(
    persist(
        set => ({
            lang: 'en',
            setLang: l => set({ lang: l })
        }),
        { name: 'calc-ap-i18n' }
    )
)

export function useT() {
    const lang = useI18n(s => s.lang)
    return (k: string) => D[lang]?.[k] ?? D.en[k] ?? k
}
