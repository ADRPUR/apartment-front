// src/components/PriceHistogram.tsx
import { PriceHistogramBin } from '../services/market'
import { formatNumber } from '../utils/formatters'

interface PriceHistogramProps {
    data: PriceHistogramBin[]
    dominantRange?: string | null
}

export function PriceHistogram({ data, dominantRange }: PriceHistogramProps) {
    // Filtrăm bin-urile cu count > 0 pentru a afișa doar intervale relevante
    const relevantBins = data.filter(bin => bin.count > 0)
    
    if (relevantBins.length === 0) {
        return null
    }

    const maxPercentage = Math.max(...relevantBins.map(bin => bin.percentage))

    return (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Distribuție Prețuri (€/m²)
            </div>

            <div className="space-y-2">
                {relevantBins.map((bin, index) => {
                    const isDominant = dominantRange && bin.label === dominantRange
                    const barWidth = maxPercentage > 0 ? (bin.percentage / maxPercentage) * 100 : 0

                    return (
                        <div key={index} className="flex items-center gap-2">
                            {/* Label interval */}
                            <div className="w-20 text-[10px] font-medium text-slate-600 dark:text-slate-400 text-right">
                                {bin.label}
                            </div>

                            {/* Bara progres */}
                            <div className="flex-1 relative h-6 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${
                                        isDominant
                                            ? 'bg-blue-600 dark:bg-blue-500'
                                            : 'bg-blue-400 dark:bg-blue-600'
                                    }`}
                                    style={{ width: `${barWidth}%` }}
                                />

                                {/* Text în bara de progres */}
                                {bin.count > 0 && (
                                    <div className="absolute inset-0 flex items-center px-2">
                                        <span className="text-[10px] font-semibold text-white drop-shadow">
                                            {bin.count} ({bin.percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Info despre intervalul dominant */}
            {dominantRange && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-[10px] text-blue-900 dark:text-blue-200">
                        <span className="font-semibold">Interval dominant:</span> {dominantRange} €/m²
                        {' '}({data.find(b => b.label === dominantRange)?.percentage.toFixed(1)}% din anunțuri)
                    </p>
                </div>
            )}
        </div>
    )
}

