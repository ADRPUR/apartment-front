import { calculate } from '../../calc/finance'
import { useConfigStore } from '../../state/configStore'

export function Warnings() {
  const cfg = useConfigStore(s => s.config)
  const r: any = calculate(cfg)
  if (!r || r.error) return null

  const msgs: string[] = []

  if (r.coverPct < 80) {
    msgs.push(
      'Net after conversion covers less than 80% of the new apartment target.'
    )
  }

  if (
    cfg.old_apartment.surface_area_sqm &&
    cfg.old_apartment.market_price_per_sqm_max
  ) {
    const marketMax =
      cfg.old_apartment.surface_area_sqm *
      cfg.old_apartment.market_price_per_sqm_max
    if (r.salePrice > marketMax) {
      msgs.push('Required sale price is above market MAX.')
    }
  }

  if (r.verificationDiff > 1) {
    msgs.push('Verification difference is notable — check fees & rates.')
  }

  if (!msgs.length) return null

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm my-4">
      <div className="font-semibold mb-1">Warnings</div>
      <ul className="list-disc ml-5 space-y-1">
        {msgs.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  )
}

