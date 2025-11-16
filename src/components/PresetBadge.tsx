import { useMemo } from 'react'
import { useConfigStore, DEFAULT_CONFIG } from '../state/configStore'

function fmtMul(n: number) {
  return (Math.round(n * 100) / 100).toFixed(2)
}

export function PresetBadge() {
  const cfg = useConfigStore(s => s.config)
  const base = DEFAULT_CONFIG

  const { mpMul, agent, months } = useMemo(() => {
    const b = base.old_apartment
    const c = cfg.old_apartment

    const mean = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 1

    const avgBase = [
      b.market_price_per_sqm_min ?? b.market_price_per_sqm ?? 0,
      b.market_price_per_sqm_avg ?? b.market_price_per_sqm ?? 0,
      b.market_price_per_sqm_max ?? b.market_price_per_sqm ?? 0
    ].filter(Boolean)

    const avgCurr = [
      c.market_price_per_sqm_min ?? c.market_price_per_sqm ?? 0,
      c.market_price_per_sqm_avg ?? c.market_price_per_sqm ?? 0,
      c.market_price_per_sqm_max ?? c.market_price_per_sqm ?? 0
    ].filter(Boolean)

    const mul = mean(avgCurr) / (mean(avgBase) || 1)

    return {
      mpMul: isFinite(mul) && mul > 0 ? mul : 1,
      agent: cfg.agent_fee.percentage,
      months: cfg.rental_income.months_lost
    }
  }, [cfg])

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="px-1 py-1 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200">
        €/m² × {fmtMul(mpMul)}
      </span>
      <span className="px-1 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
        Agent {Number(agent).toFixed(1)}%
      </span>
      <span className="px-1 py-1 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
        Months lost {months}
      </span>
    </div>
  )
}

