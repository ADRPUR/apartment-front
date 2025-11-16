import {useEffect, useRef, useState} from 'react'
import {useConfigStore, DEFAULT_CONFIG, cloneDefault} from '../state/configStore'
import {useT} from '../state/i18nStore'

type PresetKey = 'base' | 'optimistic' | 'conservative'

const PRESETS: Record<
    PresetKey,
    { label: string; multMp: number; agentPct?: number; monthsLost?: number }
> = {
    base: {label: 'Base', multMp: 1.0},
    optimistic: {label: 'Optimistic', multMp: 1.07, agentPct: 3.0, monthsLost: 0},
    conservative: {
        label: 'Conservative',
        multMp: 0.93,
        agentPct: 4.5,
        monthsLost: 2
    }
}

export function Presets() {
    const {config, replaceConfig, reset} = useConfigStore()
    const [open, setOpen] = useState(false)
    const [current, setCurrent] = useState<PresetKey>('base')
    const boxRef = useRef<HTMLDivElement>(null)
    const t = useT()

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('click', onDoc)
        return () => document.removeEventListener('click', onDoc)
    }, [])

    function setPreset(k: PresetKey) {
        setCurrent(k)
        setOpen(false)

        if (k === 'base') {
            const d = cloneDefault()
            replaceConfig({
                ...config,
                old_apartment: {
                    ...config.old_apartment,
                    market_price_per_sqm_min:
                    d.old_apartment.market_price_per_sqm_min,
                    market_price_per_sqm_avg:
                    d.old_apartment.market_price_per_sqm_avg,
                    market_price_per_sqm_max:
                    d.old_apartment.market_price_per_sqm_max,
                    market_price_per_sqm: d.old_apartment.market_price_per_sqm
                },
                agent_fee: {
                    ...config.agent_fee,
                    percentage: d.agent_fee.percentage
                },
                rental_income: {
                    ...config.rental_income,
                    months_lost: d.rental_income.months_lost
                }
            })
            return
        }

        const p = PRESETS[k]
        const base = DEFAULT_CONFIG.old_apartment

        const baseMp =
            base.market_price_per_sqm ??
            (base.market_price_per_sqm_avg ??
                base.market_price_per_sqm_min ??
                0)

        const mpMin =
            (base.market_price_per_sqm_min ?? baseMp) * p.multMp
        const mpAvg =
            (base.market_price_per_sqm_avg ?? baseMp) * p.multMp
        const mpMax =
            (base.market_price_per_sqm_max ?? baseMp) * p.multMp

        replaceConfig({
            ...config,
            old_apartment: {
                ...config.old_apartment,
                market_price_per_sqm_min: +mpMin.toFixed(2),
                market_price_per_sqm_avg: +mpAvg.toFixed(2),
                market_price_per_sqm_max: +mpMax.toFixed(2)
            },
            agent_fee: {
                ...config.agent_fee,
                percentage: p.agentPct ?? config.agent_fee.percentage
            },
            rental_income: {
                ...config.rental_income,
                months_lost:
                    p.monthsLost ?? config.rental_income.months_lost
            }
        })
    }

    return (
        <div className="flex items-center gap-3">
            <label className="text-xs opacity-75">Preset:</label>
            <div ref={boxRef} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(o => !o)}
                    className="border rounded px-3 py-2 text-xs bg-white/90 dark:bg-slate-900/30"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    {PRESETS[current].label}
                </button>
                {open && (
                    <div
                        role="listbox"
                        tabIndex={-1}
                        className="absolute z-40 mt-1 min-w-[10rem] rounded-lg border shadow-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700"
                    >
                        {(['base', 'optimistic', 'conservative'] as PresetKey[]).map(
                            k => (
                                <button
                                    key={k}
                                    role="option"
                                    aria-selected={current === k}
                                    onClick={() => setPreset(k)}
                                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 ${
                                        current === k
                                            ? 'bg-slate-50 dark:bg-slate-700/60'
                                            : ''
                                    }`}
                                >
                                    {PRESETS[k].label}
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>
            <button
                className="border rounded px-3 py-2 text-xs"
                type="button"
                onClick={() => {
                    reset()
                    setCurrent('base')
                }}
            >
                {t('btn.reset')}
            </button>
        </div>
    )
}

