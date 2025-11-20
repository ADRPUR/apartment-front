// src/components/PriceDistributionChart.tsx
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    LabelList
} from 'recharts'
import { PriceHistogramBin } from '../services/market'
import { useT } from '../state/i18nStore'

interface PriceDistributionChartProps {
    data: PriceHistogramBin[]
    dominantRange?: string | null
}

export function PriceDistributionChart({ data, dominantRange }: PriceDistributionChartProps) {
    const t = useT()
    
    // Filter out bins with no data
    const relevantBins = data.filter(bin => bin.count > 0)
    
    if (relevantBins.length === 0) {
        return null
    }

    // Prepare data for the chart
    const chartData = relevantBins.map(bin => ({
        label: bin.label,
        count: bin.count,
        percentage: bin.percentage,
        isDominant: dominantRange && bin.label === dominantRange
    }))

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload || !payload[0]) return null
        
        const data = payload[0].payload
        return (
            <div className="bg-slate-900 dark:bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
                <div className="text-xs font-semibold text-white mb-1">
                    {data.label} €/m²
                </div>
                <div className="text-xs text-slate-300">
                    <div>{t('market.total')}: <span className="font-medium text-white">{data.count}</span></div>
                    <div>Percentage: <span className="font-medium text-white">{data.percentage.toFixed(1)}%</span></div>
                </div>
            </div>
        )
    }

    // Custom label renderer for bars
    const renderCustomLabel = (props: any) => {
        const { x, y, width, height, value } = props
        return (
            <text
                x={x + width / 2}
                y={y + height / 2}
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={8}
                fontWeight="600"
            >
                {value}%
            </text>
        )
    }

    return (
        <div className="mt-1 pt-1 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                📊 {t('market.priceDistribution') || 'Price Distribution'}
            </div>

            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={chartData}
                        margin={{ top: 2, right: 2, left: -28, bottom: 12 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                        <XAxis 
                            dataKey="label" 
                            angle={-45}
                            textAnchor="end"
                            height={40}
                            tick={{ fill: '#64748b', fontSize: 8 }}
                        />
                        <YAxis 
                            tick={{ fill: '#64748b', fontSize: 8 }}
                            label={{
                                value: '%',
                                angle: -90,
                                position: 'insideLeft',
                                style: { fontSize: 8, fill: '#64748b' }
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        
                        <Bar 
                            dataKey="percentage" 
                            radius={[4, 4, 0, 0]}
                        >
                            {chartData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`}
                                    fill={entry.isDominant ? '#2563eb' : '#60a5fa'}
                                    className={entry.isDominant ? 'opacity-100' : 'opacity-80'}
                                />
                            ))}
                            <LabelList 
                                dataKey="percentage" 
                                content={renderCustomLabel}
                                formatter={(value: number) => value.toFixed(1)}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Dominant range indicator */}
            {dominantRange && (
                <div className="mt-1 p-1 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-[9px] text-blue-900 dark:text-blue-200">
                        <span className="font-semibold">🎯 Dominant:</span>{' '}
                        {dominantRange} ({data.find(b => b.label === dominantRange)?.percentage.toFixed(1)}%)
                    </p>
                </div>
            )}
        </div>
    )
}

