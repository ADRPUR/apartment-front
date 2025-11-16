import type { Config } from '../calc/finance'
import { calculate, C } from '../calc/finance'
import { AccordionSection } from './common/AccordionSection'
import { CostBreakdown } from './CostBreakdown'
import { downloadCsv } from '../utils/downloadCsv'
import { Card } from './ui/Card'

export function CostsTaxesSection({ config }: { config: Config }) {
    const r: any = calculate(config)

    const lost = config.rental_income.enabled
        ? config.rental_income.monthly_amount *
        config.rental_income.months_lost
        : 0

    const eurMdl = config.exchange_rates.eur_to_mdl
    const eurRon = config.exchange_rates.eur_to_ron
    const ronMdl = config.exchange_rates.ron_to_mdl

    const mdlViaRon = eurRon * ronMdl
    const diffPerEur = mdlViaRon - eurMdl
    const pct = mdlViaRon > 0 ? (diffPerEur / mdlViaRon) * 100 : 0

    const convPctDisplay = r.conversionPct.toFixed(4) // deja procent

    return (
        <AccordionSection title="💰 Costs and Taxes">
            {/* Info banner cursuri */}
            <Card
                className="mb-6 bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-700"
                title="Exchange Rates"
                subtitle="Conversion cost is estimated from EUR→MDL vs EUR→RON→MDL."
            >
                <div className="text-sm">
          <span className="font-semibold">
            1 EUR = {eurMdl} MDL
          </span>{' '}
                    |{' '}
                    <span className="font-semibold">
            1 EUR = {eurRon} RON
          </span>{' '}
                    |{' '}
                    <span className="font-semibold">
            1 RON = {ronMdl} MDL
          </span>
                </div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold">
            Conversion cost calculation:
          </span>{' '}
                    To convert 1 EUR received in MDL ({eurMdl} MDL) to RON equivalent (
                    {eurRon} RON), you need {eurRon} × {ronMdl} =
                    {` ${mdlViaRon.toFixed(4)} MDL.`} Cost per EUR:{' '}
                    {mdlViaRon.toFixed(4)} − {eurMdl} ={' '}
                    {diffPerEur.toFixed(4)} MDL ({pct.toFixed(4)}%).
                </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Tabel costuri */}
                <Card title="Fees and Taxes">
                    <div className="flex justify-end mb-2">
                        <button
                            className="border rounded px-3 py-1 text-xs"
                            onClick={() => {
                                const rowsCsv = [
                                    ['Description', 'Details', 'EUR'],
                                    [
                                        'Agent Fee',
                                        `${config.agent_fee.percentage}%`,
                                        r.agentFee.toFixed(2)
                                    ],
                                    [
                                        'Income Tax',
                                        `${config.income_tax.rate}%`,
                                        r.tax.toFixed(2)
                                    ],
                                    [
                                        'Lost Rental',
                                        `${config.rental_income.months_lost} months`,
                                        lost.toFixed(2)
                                    ],
                                    [
                                        'Conversion Fee',
                                        `${convPctDisplay}%`,
                                        r.convCost.toFixed(2)
                                    ],
                                    [
                                        'Notary Tax',
                                        `${(config.notary_tax?.percentage ?? 0).toFixed(1)}%`,
                                        r.notaryTax.toFixed(2)
                                    ]
                                ]
                                downloadCsv('costs_taxes.csv', rowsCsv)
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
                                <th className="text-left p-3">Details</th>
                                <th className="text-right p-3">EUR</th>
                            </tr>
                            </thead>
                            <tbody className="text-slate-900 dark:text-slate-100">
                            <tr>
                                <td className="p-3">Agent fee</td>
                                <td className="p-3">
                                    {config.agent_fee.percentage}%
                                </td>
                                <td className="p-3 text-right">
                                    €{C(r.agentFee)}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3">Income tax</td>
                                <td className="p-3">
                                    {config.income_tax.rate}%
                                </td>
                                <td className="p-3 text-right">€{C(r.tax)}</td>
                            </tr>
                            <tr>
                                <td className="p-3">Lost rent</td>
                                <td className="p-3">
                                    {config.rental_income.months_lost} months
                                </td>
                                <td className="p-3 text-right">€{C(lost)}</td>
                            </tr>
                            <tr>
                                <td className="p-3">Conversion fee</td>
                                <td className="p-3">
                                    {convPctDisplay}% of net before conversion
                                </td>
                                <td className="p-3 text-right">
                                    €{C(r.convCost)}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3">Notary tax</td>
                                <td className="p-3">
                                    {(config.notary_tax?.percentage ?? 0).toFixed(1)}%
                                </td>
                                <td className="p-3 text-right">
                                    €{C(r.notaryTax)}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Donut chart card */}
                <Card title="Cost breakdown">
                    <CostBreakdown />
                </Card>
            </div>
        </AccordionSection>
    )
}
