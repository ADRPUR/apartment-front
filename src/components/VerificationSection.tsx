import type { Config } from '../calc/finance'
import { calculate } from '../calc/finance'
import { AccordionSection } from './common/AccordionSection'
import { downloadCsv } from '../utils/downloadCsv'
import { Card } from './ui/Card'

export function VerificationSection({ config }: { config: Config }) {
    const r: any = calculate(config)

    const lost = config.rental_income.enabled
        ? config.rental_income.monthly_amount *
        config.rental_income.months_lost
        : 0

    const includeParking =
        config.new_apartment.include_parking_in_calculation
    const targetBase =
        (config.new_apartment.price_apartment || 0) +
        (includeParking ? config.new_apartment.price_parking || 0 : 0)

    const notaryTax = r.notaryTax ?? 0
    const notaryTaxRON =
        r.notaryTaxRON ?? notaryTax * r.eur_to_ron

    const targetBaseRON = targetBase * r.eur_to_ron
    const diff = r.net - r.targetWithNotary

    const rows = [
        {
            label: 'Sale Price',
            eur: r.salePrice,
            local: `${r.saleMDL.toFixed(2)} MDL`,
            tone: 'head' as const
        },
        {
            label: 'Minus: Agent Fee',
            eur: -r.agentFee,
            local: `${(-r.agentMDL).toFixed(2)} MDL`,
            tone: 'normal' as const
        },
        {
            label: 'Minus: Tax',
            eur: -r.tax,
            local: `${(-r.taxMDL).toFixed(2)} MDL`,
            tone: 'normal' as const
        },
        {
            label: 'Minus: Lost Rental',
            eur: -lost,
            local: `${(-r.lostMDL).toFixed(2)} MDL`,
            tone: 'normal' as const
        },
        {
            label: 'Net Before Conversion',
            eur: r.netBeforeConv,
            local: `${r.netBeforeConvMDL.toFixed(2)} MDL`,
            tone: 'highlight-blue' as const
        },
        {
            label: 'Minus: Conversion Fee',
            eur: -r.convCost,
            local: `${(-r.convCostMDL).toFixed(2)} MDL`,
            tone: 'normal' as const
        },
        {
            label: 'Net After Conversion',
            eur: r.net,
            local: `${r.netRON.toFixed(2)} RON`,
            tone: 'highlight-green' as const
        },
        {
            label: 'Minus: Notary Tax',
            eur: -notaryTax,
            local: `${(-notaryTaxRON).toFixed(2)} RON`,
            tone: 'normal' as const
        },
        {
            label: 'Required (Target)',
            eur: targetBase,
            local: `${targetBaseRON.toFixed(2)} RON`,
            tone: 'highlight-green-soft' as const
        },
        {
            label: 'Difference',
            eur: diff,
            local: '',
            tone: 'footer' as const
        }
    ]

    return (
        <AccordionSection title="✅ Verification">
            <Card>
                <div className="flex justify-end mb-2">
                    <button
                        className="border rounded px-3 py-1 text-xs"
                        onClick={() => {
                            downloadCsv('verification.csv', [
                                ['Item', 'EUR', 'MDL/RON'],
                                ...rows.map(rw => [
                                    rw.label,
                                    rw.eur.toFixed(2),
                                    rw.local
                                ])
                            ])
                        }}
                    >
                        Export CSV
                    </button>
                </div>

                <div className="-mx-5 md:mx-0 overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="bg-primary text-white">
                            <th className="text-left p-3">Item</th>
                            <th className="text-right p-3">EUR</th>
                            <th className="text-right p-3">MDL/RON</th>
                        </tr>
                        </thead>
                        <tbody className="text-slate-900 dark:text-slate-100">
                        {rows.map((row, i) => {
                            let rowClass =
                                'bg-white dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700'

                            if (row.tone === 'head') {
                                rowClass =
                                    'bg-white dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700 font-semibold'
                            } else if (row.tone === 'highlight-blue') {
                                rowClass =
                                    'bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 font-semibold'
                            } else if (row.tone === 'highlight-green') {
                                rowClass =
                                    'bg-emerald-100 dark:bg-emerald-900/60 border-b border-emerald-200 dark:border-emerald-800 font-semibold'
                            } else if (row.tone === 'highlight-green-soft') {
                                rowClass =
                                    'bg-emerald-50 dark:bg-emerald-900/40 border-b border-emerald-100 dark:border-emerald-800 font-semibold'
                            } else if (row.tone === 'footer') {
                                rowClass =
                                    'bg-slate-50 dark:bg-slate-800/80 font-semibold'
                            }

                            const eurVal = row.eur
                            const eurClass =
                                eurVal < 0
                                    ? 'text-rose-600'
                                    : row.tone === 'highlight-green' ||
                                    row.tone === 'highlight-green-soft'
                                        ? 'text-emerald-700 dark:text-emerald-200'
                                        : ''

                            return (
                                <tr key={i} className={rowClass}>
                                    <td className="p-3">{row.label}</td>
                                    <td className={`p-3 text-right ${eurClass}`}>
                                        {eurVal < 0 ? '− ' : ''}
                                        €{Math.abs(eurVal).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                    </td>
                                    <td className="p-3 text-right">
                                        {row.local}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AccordionSection>
    )
}
