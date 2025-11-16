import { calculate, C } from '../calc/finance'
import { useConfigStore } from '../state/configStore'

export function ResultHero() {
  const cfg = useConfigStore(s => s.config)
  const r: any = calculate(cfg)

  return (
    <section className="rounded-2xl p-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-xl">
      <div className="text-center">
        <div className="text-sm opacity-90">
          Minimum Required Sale Price
        </div>
        <div className="text-4xl font-bold">€ {C(r.salePrice)}</div>
        <div className="opacity-90 mt-2">{C(r.saleMDL)} MDL</div>
      </div>
    </section>
  )
}

