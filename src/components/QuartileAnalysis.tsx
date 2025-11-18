// src/components/QuartileAnalysis.tsx
import { useT } from '../state/i18nStore'
import { formatNumber } from '../utils/formatters'
import type { QuartileAnalysis as QuartileAnalysisType } from '../services/market'

interface QuartileAnalysisProps {
    data: QuartileAnalysisType;
}

export function QuartileAnalysis({ data }: QuartileAnalysisProps) {
    const t = useT()

    const {
        q1,
        q2,
        q3,
        iqr,
        outliers_removed,
        outliers_percentage,
        interpretation,
    } = data

    return (
        <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                    {t('quartile.title')}
                </h3>
                <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {t('quartile.badge')}
                </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('quartile.description')}
            </p>

            {/* Quartile values */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 dark:bg-slate-900/60 rounded p-3 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                        Q1 - {t('quartile.q1Label')}
                    </div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatNumber(q1)} €/m²
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {interpretation.budget_range}
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-slate-900/60 rounded p-3 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                        Q2 - {t('quartile.q2Label')}
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatNumber(q2)} €/m²
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {t('quartile.medianDescription')}
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-slate-900/60 rounded p-3 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                        Q3 - {t('quartile.q3Label')}
                    </div>
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {formatNumber(q3)} €/m²
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {interpretation.premium_range}
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-slate-900/60 rounded p-3 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                        IQR - {t('quartile.iqrLabel')}
                    </div>
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {formatNumber(iqr)} €/m²
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {t('quartile.marketWidth')}: {interpretation.market_width}
                    </div>
                </div>
            </div>

            {/* Price ranges visualization */}
            <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t('quartile.priceRanges')}
                </div>
                
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <div className="text-xs flex-1">
                            <span className="font-medium">{t('quartile.budgetRange')}:</span>{' '}
                            <span className="text-slate-600 dark:text-slate-400">
                                {interpretation.budget_range}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="text-xs flex-1">
                            <span className="font-medium">{t('quartile.affordableRange')}:</span>{' '}
                            <span className="text-slate-600 dark:text-slate-400">
                                {interpretation.affordable_range}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <div className="text-xs flex-1">
                            <span className="font-medium">{t('quartile.midRange')}:</span>{' '}
                            <span className="text-slate-600 dark:text-slate-400">
                                {interpretation.mid_range}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <div className="text-xs flex-1">
                            <span className="font-medium">{t('quartile.premiumRange')}:</span>{' '}
                            <span className="text-slate-600 dark:text-slate-400">
                                {interpretation.premium_range}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Outliers info */}
            {outliers_removed > 0 && (
                <div className="text-xs bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
                    <span className="font-medium text-yellow-800 dark:text-yellow-300">
                        {t('quartile.outliersRemoved')}:
                    </span>{' '}
                    <span className="text-yellow-700 dark:text-yellow-400">
                        {outliers_removed} {t('quartile.ads')} ({formatNumber(outliers_percentage, 1)}%)
                    </span>
                </div>
            )}

            {/* Summary */}
            <div className="text-xs bg-slate-100 dark:bg-slate-800 rounded p-3 space-y-1">
                <div className="font-medium text-slate-700 dark:text-slate-300">
                    {t('quartile.interpretation')}:
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                    {interpretation.price_range_description}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                    {interpretation.iqr_description}
                </div>
            </div>
        </div>
    )
}

