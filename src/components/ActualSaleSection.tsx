import { useState, useMemo } from 'react'
import { useConfigStore } from '../state/configStore'
import { Card } from './ui/Card'
import { C } from '../calc/finance'
import { exportSaleSummaryPdfServer } from '../utils/exportSalePdfServer'

export function ActualSaleSection() {
    const cfg = useConfigStore(s => s.config)
    const [amount, setAmount] = useState<string>('')
    const [currency, setCurrency] = useState<'EUR' | 'MDL'>('EUR')

    const summary = useMemo(() => {
        const a = parseFloat(amount.replace(',', '.'))
        if (!a || a <= 0) return null

        const eurToMdl = cfg.exchange_rates.eur_to_mdl || 0
        const purchase = cfg.old_apartment.purchase_price || 0

        let saleEur = 0
        if (currency === 'EUR') {
            saleEur = a
        } else {
            if (eurToMdl <= 0) return null
            saleEur = a / eurToMdl
        }
        const saleMdl = saleEur * eurToMdl

        const agentEnabled = cfg.agent_fee.enabled
        const agentPct = cfg.agent_fee.percentage || 0
        const agentCoef = agentEnabled ? agentPct / 100 : 0
        const agentFeeEur = saleEur * agentCoef
        const agentFeeMdl = agentFeeEur * eurToMdl

        const grossProfitEur = saleEur - purchase
        const grossProfitMdl = grossProfitEur * eurToMdl

        const taxEnabled = cfg.income_tax.enabled
        const taxRate = cfg.income_tax.rate || 0
        const taxEur =
            taxEnabled && grossProfitEur > 0
                ? (grossProfitEur / 2) * (taxRate / 100)
                : 0
        const taxMdl = taxEur * eurToMdl

        const netProfitEur = grossProfitEur - agentFeeEur - taxEur
        const netProfitMdl = netProfitEur * eurToMdl

        // 🔹 Venit net = Sale price - Agent fee - Income tax
        const netIncomeEur = saleEur - agentFeeEur - taxEur
        const netIncomeMdl = saleMdl - agentFeeMdl - taxMdl

        return {
            saleEur,
            saleMdl,
            agentFeeEur,
            agentFeeMdl,
            taxEur,
            taxMdl,
            grossProfitEur,
            grossProfitMdl,
            netProfitEur,
            netProfitMdl,
            netIncomeEur,
            netIncomeMdl
        }
    }, [amount, currency, cfg])

    const fld =
        'border rounded px-3 py-2 w-full bg-white/90 dark:bg-slate-900/30 text-xs'
    const lbl = 'text-xs opacity-80'
    const selectCls =
        'border rounded px-2 py-2 bg-white/90 dark:bg-slate-900/30 text-xs'

    return (
        <section className="mt-10">
            <Card
                title="Actual Sale Scenario"
                subtitle="Enter the negotiated sale price and see commission, taxes and net profit."
            >
                <div className="grid md:grid-cols-[2fr,3fr] gap-6">
                    {/* Form */}
                    <div className="space-y-3">
                        <div>
                            <div className={lbl}>Sale price</div>
                            <div className="flex gap-2 mt-1">
                                <input
                                    type="number"
                                    step="0.01"
                                    className={fld}
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="e.g. 120000"
                                />
                                <select
                                    className={selectCls}
                                    value={currency}
                                    onChange={e =>
                                        setCurrency(e.target.value as 'EUR' | 'MDL')
                                    }
                                >
                                    <option value="EUR">EUR</option>
                                    <option value="MDL">MDL</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Agent fee and income tax will use the same percentages
                            as in the main configuration. Sale price is converted
                            to EUR using the current EUR→MDL rate.
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-800 shadow-sm disabled:opacity-50"
                            disabled={!summary}
                            onClick={() => {
                                const a = parseFloat(amount.replace(',', '.'))
                                if (!a || a <= 0) {
                                    alert('Please enter a valid sale price.')
                                    return
                                }
                                exportSaleSummaryPdfServer(cfg, a, currency)
                            }}
                        >
                            <span>📄</span>
                            <span>Export Sale Summary PDF</span>
                        </button>
                    </div>

                    {/* Results */}
                    <div className="border rounded-lg bg-slate-50/80 dark:bg-slate-900/40 px-4 py-3 text-xs">
                        {!summary ? (
                            <div className="opacity-60">
                                Enter a sale price to see the breakdown.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                                    Calculated breakdown
                                </div>

                                <Row
                                    label="Sale price"
                                    eur={`€ ${C(summary.saleEur)}`}
                                    mdl={`${C(summary.saleMdl)} MDL`}
                                />
                                <Row
                                    label="Agent fee"
                                    eur={`€ ${C(summary.agentFeeEur)}`}
                                    mdl={`${C(summary.agentFeeMdl)} MDL`}
                                />
                                <Row
                                    label="Income tax"
                                    eur={`€ ${C(summary.taxEur)}`}
                                    mdl={`${C(summary.taxMdl)} MDL`}
                                />
                                <Row
                                    label="Gross profit (vs purchase)"
                                    eur={`€ ${C(summary.grossProfitEur)}`}
                                    mdl={`${C(summary.grossProfitMdl)} MDL`}
                                />
                                <Row
                                    label="Net profit (after agent + tax)"
                                    eur={`€ ${C(summary.netProfitEur)}`}
                                    mdl={`${C(summary.netProfitMdl)} MDL`}
                                />
                                <Row
                                    label="Net income (sale - agent - tax)"
                                    eur={`€ ${C(summary.netIncomeEur)}`}
                                    mdl={`${C(summary.netIncomeMdl)} MDL`}
                                    highlight
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </section>
    )
}

function Row(props: {
    label: string
    eur: string
    mdl: string
    highlight?: boolean
}) {
    return (
        <div className="flex justify-between gap-3 border-b border-slate-200/70 dark:border-slate-700/60 pb-1 mb-1 last:border-b-0 last:pb-0 last:mb-0">
            <div
                className={
                    'flex-1 ' + (props.highlight ? 'font-semibold text-emerald-600 dark:text-emerald-400' : '')
                }
            >
                {props.label}
            </div>
            <div className="text-right min-w-[80px]">{props.eur}</div>
            <div className="text-right min-w-[100px] opacity-80">
                {props.mdl}
            </div>
        </div>
    )
}
