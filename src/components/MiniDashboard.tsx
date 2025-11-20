// src/components/MiniDashboard.tsx
import { useMemo } from 'react'
import { MarketStats, QuartileAnalysis } from '../services/market'
import { formatNumber } from '../utils/formatters'
import { useT } from '../state/i18nStore'
import { useConfigStore } from '../state/configStore'

interface MiniDashboardProps {
    marketData: MarketStats
    quartileAnalysis: QuartileAnalysis
}

export function MiniDashboard({ marketData, quartileAnalysis }: MiniDashboardProps) {
    const t = useT()
    const config = useConfigStore(s => s.config)

    // Calculate recommended price based on Q2 (median) and user's apartment
    const userSurfaceArea = config.old_apartment.surface_area_sqm || 0
    const userPurchasePrice = config.old_apartment.purchase_price || 0
    
    const recommendedPricePerSqm = quartileAnalysis.q2
    const recommendedTotalPrice = userSurfaceArea * recommendedPricePerSqm
    
    // Listing range suggestions (Q1 to Q3)
    const listingRangeLow = userSurfaceArea * quartileAnalysis.q1
    const listingRangeHigh = userSurfaceArea * quartileAnalysis.q3
    
    // Calculate percentile position of user's potential listing price
    // We'll use the median price as reference
    const userCurrentPricePerSqm = userSurfaceArea > 0 
        ? userPurchasePrice / userSurfaceArea 
        : 0
    
    // Simple percentile estimation based on quartiles
    const percentilePosition = useMemo(() => {
        if (userCurrentPricePerSqm === 0) return null
        
        const q1 = quartileAnalysis.q1
        const q2 = quartileAnalysis.q2
        const q3 = quartileAnalysis.q3
        
        if (userCurrentPricePerSqm < q1) {
            // Below Q1 - estimate 0-25%
            const ratio = userCurrentPricePerSqm / q1
            return Math.max(0, ratio * 25)
        } else if (userCurrentPricePerSqm < q2) {
            // Between Q1 and Q2 - 25-50%
            const ratio = (userCurrentPricePerSqm - q1) / (q2 - q1)
            return 25 + (ratio * 25)
        } else if (userCurrentPricePerSqm < q3) {
            // Between Q2 and Q3 - 50-75%
            const ratio = (userCurrentPricePerSqm - q2) / (q3 - q2)
            return 50 + (ratio * 25)
        } else {
            // Above Q3 - estimate 75-100%
            const ratio = Math.min(2, (userCurrentPricePerSqm - q3) / (q3 - q2))
            return 75 + (ratio * 12.5)
        }
    }, [userCurrentPricePerSqm, quartileAnalysis])

    // Determine positioning category
    const positioningCategory = useMemo(() => {
        if (!percentilePosition) return null
        
        if (percentilePosition < 25) return { label: t('dashboard.budgetTier') || 'Budget', color: 'blue' }
        if (percentilePosition < 50) return { label: t('dashboard.affordableTier') || 'Affordable', color: 'green' }
        if (percentilePosition < 75) return { label: t('dashboard.midTier') || 'Mid-range', color: 'purple' }
        return { label: t('dashboard.premiumTier') || 'Premium', color: 'orange' }
    }, [percentilePosition, t])

    const profit = recommendedTotalPrice - userPurchasePrice
    const profitMargin = userPurchasePrice > 0 ? (profit / userPurchasePrice) * 100 : 0

    return (
        <div className="border-2 border-blue-500 dark:border-blue-600 rounded-xl p-5 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    <span>{t('dashboard.title') || 'Market Position Dashboard'}</span>
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-600 text-white font-semibold">
                    {t('dashboard.allPlatforms') || 'All Platforms'}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Median Market Price */}
                <div className="bg-white dark:bg-slate-800/60 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                        📊 {t('dashboard.medianPrice') || 'Median Market Price'}
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatNumber(marketData.median_price_per_sqm)} €/m²
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t('dashboard.basedOn') || 'Based on'} {marketData.total_ads} {t('market.ads') || 'listings'}
                    </div>
                </div>

                {/* Recommended Price */}
                <div className="bg-white dark:bg-slate-800/60 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                        💰 {t('dashboard.recommendedPrice') || 'Recommended Price'}
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        €{formatNumber(recommendedTotalPrice, 0)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {userSurfaceArea}m² × {formatNumber(recommendedPricePerSqm)} €/m²
                    </div>
                    {profit !== 0 && (
                        <div className={`text-xs font-medium mt-1 ${profit > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {profit > 0 ? '↗' : '↘'} {profit > 0 ? '+' : ''}{formatNumber(profitMargin, 1)}% 
                            {' '}({profit > 0 ? '+' : ''}{formatNumber(profit, 0)} €)
                        </div>
                    )}
                </div>

                {/* Recommended Listing Range */}
                <div className="bg-white dark:bg-slate-800/60 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                        📍 {t('dashboard.listingRange') || 'Recommended Listing Range'}
                    </div>
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        €{formatNumber(listingRangeLow, 0)} - €{formatNumber(listingRangeHigh, 0)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t('dashboard.rangeDescription') || 'Q1 to Q3 range (50% of market)'}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400">
                            <span>Q1: €{formatNumber(listingRangeLow, 0)}</span>
                            <span>Q3: €{formatNumber(listingRangeHigh, 0)}</span>
                        </div>
                    </div>
                </div>

                {/* Percentile Position */}
                {percentilePosition !== null && positioningCategory && (
                    <div className="bg-white dark:bg-slate-800/60 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                            🎚️ {t('dashboard.marketPosition') || 'Your Market Position'}
                        </div>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {formatNumber(percentilePosition, 1)}%
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {userCurrentPricePerSqm > 0 
                                ? `${formatNumber(userCurrentPricePerSqm)} €/m²`
                                : t('dashboard.noData') || 'No data'
                            }
                        </div>
                        <div className="mt-2">
                            <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold
                                ${positioningCategory.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : ''}
                                ${positioningCategory.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : ''}
                                ${positioningCategory.color === 'purple' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : ''}
                                ${positioningCategory.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' : ''}
                            `}>
                                {positioningCategory.label}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Market Stats Summary */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                            {t('market.minPriceSqm') || 'Min'}
                        </div>
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {formatNumber(marketData.min_price_per_sqm)}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                            {t('market.avgPriceSqm') || 'Avg'}
                        </div>
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {formatNumber(marketData.avg_price_per_sqm)}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                            {t('market.medianPriceSqm') || 'Median'}
                        </div>
                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {formatNumber(marketData.median_price_per_sqm)}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                            {t('market.maxPriceSqm') || 'Max'}
                        </div>
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {formatNumber(marketData.max_price_per_sqm)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Insight Box */}
            {marketData.dominant_range && (
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-start gap-2">
                        <span className="text-lg">💡</span>
                        <div className="flex-1 text-xs">
                            <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                                {t('dashboard.insight') || 'Market Insight'}
                            </p>
                            <p className="text-indigo-700 dark:text-indigo-300">
                                {t('dashboard.insightText') || 'Most listings'} ({marketData.dominant_percentage?.toFixed(1)}%) 
                                {' '}{t('dashboard.insightText2') || 'are priced in the'} <strong>{marketData.dominant_range} €/m²</strong> {t('dashboard.insightText3') || 'range'}.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

