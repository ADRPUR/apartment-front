import { useMemo } from 'react'
import { useConfigStore } from '../state/configStore'
import { C } from '../utils/formatters'
import { Card } from './ui/Card'
import { useAggregatedMarketData } from '../hooks/useMarketData'
import { useCalculation } from '../hooks/useCalculation'

export function OverviewSection() {
    const cfg = useConfigStore(s => s.config)
    const r = useCalculation(cfg)

    const eurToRon = cfg.exchange_rates.eur_to_ron
    const eurToMdl = cfg.exchange_rates.eur_to_mdl

    // Use custom hook for aggregated market data (source = "all")
    const { data: marketData } = useAggregatedMarketData()
    const medianAllSqm = marketData?.median_price_per_sqm ?? null

    // New apartment
    const apt = cfg.new_apartment.price_apartment || 0
    const park = cfg.new_apartment.price_parking || 0
    const notaryPct =
        cfg.notary_tax?.enabled && cfg.notary_tax?.percentage
            ? cfg.notary_tax.percentage
            : 0
    const notaryFee = (apt + park) * (notaryPct / 100)
    const totalToPay = apt + park + notaryFee

    // Old apartment
    const purchase = cfg.old_apartment.purchase_price || 0
    const minSale = r.salePrice || 0
    const grossProfit = minSale - purchase
    const grossPct = purchase > 0 ? (grossProfit / purchase) * 100 : 0

    // Surface (m²)
    const surface = cfg.old_apartment.surface_area_sqm || 0

    const avgPricePerSqm = cfg.old_apartment.market_price_per_sqm_avg || 0

    // Memoized calculations for listing price
    const { listingPrice, listingFormulaNote } = useMemo(() => {
        let price: number
        let note: string

        if (surface > 0 && medianAllSqm && medianAllSqm > 0) {
            // New formula: surface * aggregated median €/m²
            price = surface * medianAllSqm
            note = `(${surface.toFixed(1)} m² × ${medianAllSqm.toFixed(
                2
            )} €/m² median all platforms)`
        } else {
            price = surface * avgPricePerSqm
            note = `(${surface.toFixed(1)} m² × ${avgPricePerSqm.toFixed(
                2
            )} €/m² average market price)`
        }

        return { listingPrice: price, listingFormulaNote: note }
    }, [surface, medianAllSqm, avgPricePerSqm])

    const netForNew = r.targetWithNotary || 0 // net necesar pentru apartament nou

    const fmtRON = useMemo(
        () => (eur: number) => `${C(eur * eurToRon)} RON`,
        [eurToRon]
    )
    const fmtMDL = useMemo(
        () => (eur: number) => `${C(eur * eurToMdl)} MDL`,
        [eurToMdl]
    )

    return (
        <section className="space-y-8">
            {/* New Apartment - Target */}
            <div>
                <SectionHeader icon="🎯" label="New Apartment - Target" />
                <Card className="mt-3">
                    <div className="px-1 pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
                        <span className="font-semibold">📍 Address:</span>{' '}
                        <span>{cfg.new_apartment.address}</span>
                    </div>
                    <div className="grid md:grid-cols-4 gap-3">
                        <InfoTile
                            title="Apartment Price"
                            primary={`€ ${C(apt)}`}
                            secondary={fmtRON(apt)}
                            accent="border-l-4 border-sky-400"
                        />
                        <InfoTile
                            title="Parking Space Price"
                            primary={`€ ${C(park)}`}
                            secondary={fmtRON(park)}
                            accent="border-l-4 border-blue-400"
                        />
                        <InfoTile
                            title={`Notary Tax (${notaryPct || 0}%)`}
                            primary={`€ ${C(notaryFee)}`}
                            secondary={fmtRON(notaryFee)}
                            accent="border-l-4 border-emerald-400 bg-emerald-50/60 dark:bg-emerald-900/20"
                        />
                        <InfoTile
                            title="Total to Pay"
                            primary={`€ ${C(totalToPay)}`}
                            secondary={fmtRON(totalToPay)}
                            accent="border-l-4 border-emerald-500 bg-emerald-50/80 dark:bg-emerald-900/30"
                        />
                    </div>
                </Card>
            </div>

            {/* Old Apartment - Sale Details */}
            <div>
                <SectionHeader icon="🏠" label="Old Apartment - Sale Details" />
                <Card className="mt-3">
                    <div className="px-1 pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
                        <span className="font-semibold">📍 Address:</span>{' '}
                        <span>{cfg.old_apartment.address}</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                        <InfoTile
                            title="Original Purchase Price"
                            primary={`€ ${C(purchase)}`}
                            secondary={fmtMDL(purchase)}
                            accent="border-l-4 border-slate-300"
                        />
                        <InfoTile
                            title="Minimum Sale Price"
                            primary={`€ ${C(minSale)}`}
                            secondary={fmtMDL(minSale)}
                            accent="border-l-4 border-emerald-400 bg-emerald-50/60 dark:bg-emerald-900/20"
                        />
                        <InfoTile
                            title="Gross Profit"
                            primary={`€ ${C(grossProfit)}`}
                            secondary={`${fmtMDL(grossProfit)} (${C(
                                grossPct
                            )}% increase)`}
                            accent="border-l-4 border-sky-400 bg-sky-50/60 dark:bg-sky-900/30"
                        />
                    </div>
                </Card>
            </div>

            {/* Summary */}
            <div>
                <SectionHeader icon="🧾" label="Summary" />
                <Card className="mt-3">
                    <div className="grid md:grid-cols-3 gap-3">
                        <InfoTile
                            title="Recommended Listing Price"
                            primary={`€ ${C(listingPrice)}`}
                            secondary={`${fmtMDL(
                                listingPrice
                            )} ${listingFormulaNote}`}
                            accent="border-l-4 border-amber-400 bg-amber-50/80 dark:bg-amber-900/30"
                        />
                        <InfoTile
                            title="Investment Return"
                            primary={`${C(r.invReturnPct)}%`}
                            secondary="Increase vs. purchase price"
                            accent="border-l-4 border-sky-400 bg-sky-50/80 dark:bg-sky-900/30"
                        />
                        <InfoTile
                            title="Net Amount for New Apartment"
                            primary={`€ ${C(netForNew)}`}
                            secondary={`${fmtRON(netForNew)} • Covers ${C(
                                r.coverPct
                            )}% of target`}
                            accent="border-l-4 border-emerald-500 bg-emerald-50/80 dark:bg-emerald-900/30"
                        />
                    </div>
                </Card>
            </div>
        </section>
    )
}

function SectionHeader({ icon, label }: { icon: string; label: string }) {
    return (
        <>
            <div className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
                <span>{icon}</span>
                <span>{label}</span>
            </div>
            <div className="mt-1 h-[2px] bg-indigo-500 rounded-full" />
        </>
    )
}

function InfoTile(props: {
    title: string
    primary: string
    secondary?: string
    accent?: string
}) {
    return (
        <div
            className={`
        rounded-lg 
        bg-slate-50 dark:bg-slate-900/40 
        px-4 py-3 
        border border-slate-200 dark:border-slate-700 
        flex flex-col justify-between
        ${props.accent ?? ''}
      `}
        >
            <div className="text-sm opacity-75">{props.title}</div>
            <div className="mt-1 text-xl font-semibold">{props.primary}</div>
            {props.secondary && (
                <div className="mt-1 text-xs opacity-70">{props.secondary}</div>
            )}
        </div>
    )
}
