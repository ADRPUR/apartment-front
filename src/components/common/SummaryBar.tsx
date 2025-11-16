import { calculate, C } from '../../calc/finance'
import { useConfigStore } from '../../state/configStore'
import { useT } from '../../state/i18nStore'
import { LangToggle } from './LangToggle'

export function SummaryBar() {
  const cfg = useConfigStore(s => s.config)
  const dark = useConfigStore(s => s.dark)
  const toggle = useConfigStore(s => s.toggleDark)
  const r: any = calculate(cfg)
  const t = useT()

  const rateMeta = (window as any)
    .__rateMeta as
    | { source?: string; dates?: Record<string, string | null> }
    | undefined

  const sourceLabel = rateMeta?.source
    ? `Rates: ${rateMeta.source}${
        rateMeta.dates
          ? ` (${Object.values(rateMeta.dates)[0] ?? ''})`
          : ''
      }`
    : ''

  return (
    <div className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-wrap md:flex-nowrap items-center gap-y-2 gap-x-8 md:gap-x-12">
        <div className="min-w-[220px]">
          <div className="text-xs uppercase opacity-70">
            {t('kpi.minRequired')}
          </div>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            € {C(r.salePrice)}
          </div>
        </div>
        <div className="min-w-[140px]">
          <div className="text-xs uppercase opacity-70">
            {t('kpi.profit')}
          </div>
          <div className="text-xl font-semibold">
            {C(r.invReturnPct)}%
          </div>
        </div>
        <div className="min-w-[140px]">
          <div className="text-xs uppercase opacity-70">
            {t('kpi.cover')}
          </div>
          <div className="text-xl font-semibold">
            {C(r.coverPct)}%
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <LangToggle />
          {sourceLabel && (
            <span
              className="text-xs opacity-70 max-w-[32ch] truncate"
              title={sourceLabel}
            >
              {sourceLabel}
            </span>
          )}
          <button
            className="px-3 py-1 rounded border text-xs flex items-center gap-1"
            onClick={toggle}
          >
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </div>
  )
}

