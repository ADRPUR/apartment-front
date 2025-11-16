// src/components/MarketAnalysis.tsx
import { useMemo } from 'react'
import { Card } from './ui/Card'
import { useT } from '../state/i18nStore'
import { useMarketData } from '../hooks/useMarketData'
import { formatNumber } from '../utils/formatters'
type SourceKey = 'proimobil.md' | 'accesimobil.md' | 'all'
export function MarketAnalysis() {
    const t = useT()
    const { data, loading, error } = useMarketData()
    const labelMap: Record<SourceKey, string> = useMemo(() => ({
        'proimobil.md': 'Proimobil.md',
        'accesimobil.md': 'AccesImobil.md',
        all: t('market.allLabel') ?? 'All platforms'
    }), [t])
    const handleOpenUrl = (url: string | null | undefined) => {
        if (!url) return
        window.open(url, '_blank', 'noopener,noreferrer')
    }
    const orderedSources: SourceKey[] = ['proimobil.md', 'accesimobil.md', 'all']
    return (
        <Card
            title={t('market.title')}
            subtitle={t('market.subtitle') ?? ''}
        >
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {t('market.disclaimer')}
            </div>
            {loading && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {t('market.loading')}
                </div>
            )}
            {!loading && error && (
                <div className="text-xs text-red-600 dark:text-red-300 mb-2">
                    {t('market.errorDetails')}: {error}
                </div>
            )}
            <div className="space-y-3">
                {orderedSources.map(sourceKey => {
                    const sourceData = data?.find(s => s.source === sourceKey) || null
                    const hasError = !loading && !sourceData && !!data
                    const isSummary = sourceKey === 'all'
                    return (
                        <div
                            key={sourceKey}
                            className="border rounded-lg p-3 bg-white/70 dark:bg-slate-900/40 text-xs flex flex-col gap-2"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div
                                    className={`font-semibold text-slate-800 dark:text-slate-100 ${
                                        sourceData?.url
                                            ? 'cursor-pointer underline decoration-dotted underline-offset-4'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        sourceData?.url && handleOpenUrl(sourceData.url)
                                    }
                                >
                                    {labelMap[sourceKey]}
                                </div>
                                {loading && (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                                        {t('market.loading')}
                                    </span>
                                )}
                                {hasError && (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200">
                                        {t('market.error')}
                                    </span>
                                )}
                            </div>
                            {!loading && sourceData && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="opacity-70">
                                            {t('market.total')}
                                        </span>
                                        <span className="font-medium">
                                            {formatNumber(sourceData.total_ads, 0)}
                                        </span>
                                    </div>
                                    <div className="border-t border-slate-200 dark:border-slate-800 my-1" />
                                    <div className="flex justify-between">
                                        <span className="opacity-70">
                                            {t('market.minPriceSqm')}
                                        </span>
                                        <span className="font-medium">
                                            {formatNumber(sourceData.min_price_per_sqm)} €/m²
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-70">
                                            {t('market.avgPriceSqm')}
                                        </span>
                                        <span className="font-medium">
                                            {formatNumber(sourceData.avg_price_per_sqm)} €/m²
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-70">
                                            {t('market.medianPriceSqm')}
                                        </span>
                                        <span className="font-medium">
                                            {formatNumber(sourceData.median_price_per_sqm)} €/m²
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-70">
                                            {t('market.maxPriceSqm')}
                                        </span>
                                        <span className="font-medium">
                                            {formatNumber(sourceData.max_price_per_sqm)} €/m²
                                        </span>
                                    </div>
                                    {!isSummary && sourceData.url && (
                                        <div className="mt-2 text-[10px] opacity-60">
                                            {t('market.openSiteHint') ??
                                                'Click on the title to open the listing.'}
                                        </div>
                                    )}
                                    {isSummary && (
                                        <div className="mt-2 text-[10px] opacity-60">
                                            {t('market.summaryHint') ??
                                                'Aggregate statistics for all platforms.'}
                                        </div>
                                    )}
                                </>
                            )}
                            {!loading && !sourceData && !hasError && (
                                <div className="text-[11px] opacity-60 mt-1">
                                    {t('market.noData') ?? 'No data available.'}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}
