// src/components/MarketAnalysis.tsx
import { useMemo } from 'react'
import { Card } from './ui/Card'
import { useT } from '../state/i18nStore'
import { useMarketData } from '../hooks/useMarketData'
import { formatNumber } from '../utils/formatters'
import { PriceHistogram } from './PriceHistogram'
import { PriceDistributionChart } from './PriceDistributionChart'
import { QuartileAnalysis } from './QuartileAnalysis'
import { MiniDashboard } from './MiniDashboard'
type SourceKey = 'proimobil.md' | 'accesimobil.md' | '999.md' | 'all'
export function MarketAnalysis() {
    const t = useT()
    const { data, loading, error } = useMarketData()
    const labelMap: Record<SourceKey, string> = useMemo(() => ({
        'proimobil.md': 'Proimobil.md',
        'accesimobil.md': 'AccesImobil.md',
        '999.md': '999.md',
        all: t('market.allLabel') ?? 'All platforms'
    }), [t])
    const handleOpenUrl = (url: string | null | undefined) => {
        if (!url) return
        window.open(url, '_blank', 'noopener,noreferrer')
    }
    const orderedSources: SourceKey[] = ['proimobil.md', 'accesimobil.md', '999.md', 'all']
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

            {/* Quartile Analysis Section */}
            {!loading && data?.quartile_analysis && (
                <div className="mb-6">
                    <QuartileAnalysis data={data.quartile_analysis} />
                </div>
            )}

            {/* Mini Dashboard for "all" platforms */}
            {!loading && data?.quartile_analysis && data?.sources && (() => {
                const allPlatformsData = data.sources.find(s => s.source === 'all')
                return allPlatformsData ? (
                    <div className="mb-6">
                        <MiniDashboard
                            marketData={allPlatformsData}
                            quartileAnalysis={data.quartile_analysis}
                        />
                    </div>
                ) : null
            })()}

            {/* All source cards including All platforms in 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                {orderedSources.map(sourceKey => {
                    const sourceData = data?.sources?.find(s => s.source === sourceKey) || null
                    const hasError = !loading && !sourceData && !!data
                    const isSummary = sourceKey === 'all'
                    return (
                        <div
                            key={sourceKey}
                            className="border rounded p-2 bg-white/70 dark:bg-slate-900/40"
                        >
                            <div className="flex items-center justify-between mb-1.5">
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
                                <div className="space-y-0.5">
                                    <div className="flex justify-between">
                                        <span className="opacity-70">
                                            {t('market.total')}
                                        </span>
                                        <span className="font-medium">
                                            {formatNumber(sourceData.total_ads, 0)}
                                        </span>
                                    </div>
                                    <div className="border-t border-slate-200 dark:border-slate-800 my-0.5" />
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

                                    {/* Quartile data */}
                                    {sourceData.q1_price_per_sqm > 0 && (
                                        <>
                                            <div className="border-t border-slate-200 dark:border-slate-800 my-0.5" />
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-1.5 space-y-0.5">
                                                <div className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                                                    {t('market.quartileData')}
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="opacity-70">Q1</span>
                                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                                        {formatNumber(sourceData.q1_price_per_sqm)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="opacity-70">Q2</span>
                                                    <span className="font-medium text-green-600 dark:text-green-400">
                                                        {formatNumber(sourceData.q2_price_per_sqm)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="opacity-70">Q3</span>
                                                    <span className="font-medium text-purple-600 dark:text-purple-400">
                                                        {formatNumber(sourceData.q3_price_per_sqm)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="opacity-70">IQR</span>
                                                    <span className="font-medium text-orange-600 dark:text-orange-400">
                                                        {formatNumber(sourceData.iqr_price_per_sqm)}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Price Distribution Histogram for individual sources only */}
                                    {!isSummary && sourceData.price_histogram && sourceData.price_histogram.length > 0 && (
                                        <PriceHistogram
                                            data={sourceData.price_histogram}
                                            dominantRange={sourceData.dominant_range}
                                        />
                                    )}

                                    {!isSummary && sourceData.url && (
                                        <div className="mt-1 text-[10px] opacity-60">
                                            {t('market.openSiteHint') ??
                                                'Click on the title to open the listing.'}
                                        </div>
                                    )}
                                    {isSummary && (
                                        <div className="mt-1 text-[10px] opacity-60">
                                            {t('market.summaryHint') ??
                                                'Aggregate statistics for all platforms.'}
                                        </div>
                                    )}
                                </div>
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

            {/* Price Distribution Chart - full width */}
            {!loading && (() => {
                const allPlatformsData = data?.sources?.find(s => s.source === 'all')
                if (!allPlatformsData || !allPlatformsData.price_histogram || allPlatformsData.price_histogram.length === 0) {
                    return null
                }

                return (
                    <div className="border rounded p-2 bg-white/70 dark:bg-slate-900/40 text-xs">
                        <PriceDistributionChart
                            data={allPlatformsData.price_histogram}
                            dominantRange={allPlatformsData.dominant_range}
                        />
                    </div>
                )
            })()}
        </Card>
    )
}
