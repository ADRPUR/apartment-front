import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Config } from '../calc/finance'

export const DEFAULT_CONFIG: Config = {
  meta: { generated_at: '' },
  new_apartment: {
    address:
      'str. Drumul Gura Gârliței nr. 56-62, ap. 7, sector 3, București, România',
    price_apartment: 77189,
    price_parking: 8470,
    include_parking_in_calculation: true,
    notary_country: 'RON'
  },
  old_apartment: {
    address:
      'str-la 2 Florarii 4, ap. 228, Rascani, Chișinău, Republica Moldova',
    purchase_price: 17800,
    surface_area_sqm: 50.2,
    market_price_per_sqm_min: 1800,
    market_price_per_sqm_avg: 2150,
    market_price_per_sqm_max: 2400
  },
  exchange_rates: {
    eur_to_mdl: 19.6497,
    eur_to_ron: 5.0845,
    ron_to_mdl: 3.9
  },
  currency_conversion: { enabled: true },
  notary_tax: { enabled: true, percentage: 1.0 },
  agent_fee: { enabled: true, percentage: 4.0 },
  income_tax: { enabled: true, rate: 12 },
  rental_income: { enabled: false, monthly_amount: 0, months_lost: 0 }
}

export const cloneDefault = (): Config =>
  JSON.parse(JSON.stringify(DEFAULT_CONFIG))

type Store = {
  config: Config
  setConfig: (patch: Partial<Config>) => void
  replaceConfig: (cfg: Config) => void
  reset: () => void
  dark: boolean
  toggleDark: () => void
}

export const useConfigStore = create<Store>()(
  persist(
    (set, get) => ({
      config: cloneDefault(),

      setConfig: patch =>
        set({
          config: { ...get().config, ...patch }
        }),

      replaceConfig: cfg =>
        set({
          config: JSON.parse(JSON.stringify(cfg))
        }),

      reset: () => set({ config: cloneDefault() }),

      dark: false,
      toggleDark: () => {
        const d = !get().dark
        set({ dark: d })
        document.documentElement.classList.toggle('dark', d)
      }
    }),
    { name: 'calc-ap-config' }
  )
)

