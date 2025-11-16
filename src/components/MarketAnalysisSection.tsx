import type { Config } from '../calc/finance'
import { calculate, C } from '../calc/finance'
import { AccordionSection } from './common/AccordionSection'
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceLine,
    CartesianGrid,
    Cell
} from 'recharts'
import { Card } from './ui/Card'

export function MarketAnalysisSection({ config }: { config: Config }) {
    const r: any = calculate(config)
    const s = config.old_apartment.surface_area_sqm || 0
    const rows = [
        { label: 'Minimum', key: 'MIN', mp: config.old_apartment.market_price_per_sqm_min || 0 },
        { label: 'Average', key: 'AVG', mp: config.old_apartment.market_price_per_sqm_avg || 0 },
        { label: 'Maximum', key: 'MAX', mp: config.old_apartment.market_price_per_sqm_max || 0 }
    ].map(x => ({ ...x, total: s * x.mp }))

    const data = rows.map(rw => ({ name: rw.label, value: rw.total }))
    const maxTotal = Math.max(r.salePrice, ...rows.map(rw => rw.total), 1)

    const barPalette = ['#0284c7', '#eab308', '#10b981']
    const refLine = '#f97373'
    const refLabel = '#b91c1c'

    return (
        <AccordionSection title="📊 Market Analysis - Price Range">
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Chart card */}
                <Card title="Market vs Required (chart)">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: '1px solid #1e293b',
                                        color: '#f8fafc'
                                    }}
                                    labelStyle={{ color: '#f8fafc' }}
                                    formatter={(v: any) => [`€${Number(v).toFixed(0)}`, 'Total']}
                                />

                                {/* întâi barele, apoi linia – ca să se vadă deasupra */}
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {data.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={barPalette[i % barPalette.length]}
                                        />
                                    ))}
                                </Bar>

                                <ReferenceLine
                                    y={r.salePrice}
                                    label={{
                                        value: `Required €${C(r.salePrice)}`,
                                        fill: refLabel,
                                        fontSize: 12,
                                        position: 'top'
                                    }}
                                    stroke={refLine}
                                    strokeDasharray="4 4"
                                    strokeWidth={2}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Table card */}
                <Card title="Scenario comparison">
                    <div className="overflow-x-auto -mx-5 md:mx-0">
                        <table className="min-w-full text-sm">
                            <thead>
                            <tr className="bg-primary text-white">
                                <th className="text-left p-3">Scenario</th>
                                <th className="text-right p-3">€/m²</th>
                                <th className="text-right p-3">Total (EUR)</th>
                                <th className="text-right p-3">Progress</th>
                            </tr>
                            </thead>
                            <tbody className="text-slate-900 dark:text-slate-100">
                            {rows.map((row, i) => {
                                const pct = Math.min(
                                    100,
                                    Math.max(0, (row.total / maxTotal) * 100)
                                )
                                const diff = row.total - r.salePrice
                                const barColor =
                                    diff >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                                const bgStriped =
                                    i === 0
                                        ? 'bg-amber-50 dark:bg-amber-900/20'
                                        : i === 1
                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                            : 'bg-green-50 dark:bg-green-900/20'

                                return (
                                    <tr key={i} className={bgStriped}>
                                        <td className="p-3 font-semibold">{row.label}</td>
                                        <td className="p-3 text-right">€{C(row.mp)}</td>
                                        <td className="p-3 text-right">€{C(row.total)}</td>
                                        <td className="p-3">
                                            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded">
                                                <div
                                                    className={`h-3 rounded ${barColor}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <div className="text-right text-xs opacity-70 mt-1">
                                                {diff >= 0 ? '+' : ''}
                                                {C(diff)} vs required
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            <tr className="bg-gray-100 dark:bg-slate-700 font-semibold">
                                <td className="p-3" colSpan={2}>
                                    Minimum Price Required
                                </td>
                                <td className="p-3 text-right" colSpan={2}>
                                    €{C(r.salePrice)}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AccordionSection>
    )
}
