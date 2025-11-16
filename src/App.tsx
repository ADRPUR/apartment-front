import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useConfigStore } from './state/configStore'
import { SummaryBar } from './components/common/SummaryBar'
import { Header } from './components/ui/Header'
import { MarketAnalysisSection } from './components/MarketAnalysisSection'
import { MarketAnalysis } from './components/MarketAnalysis'
import { CostsTaxesSection } from './components/CostsTaxesSection'
import { VerificationSection } from './components/VerificationSection'
import { Warnings } from './components/common/Warnings'
import { initUrlSync } from './state/urlSync'
import { useT } from './state/i18nStore'
import { OverviewSection } from './components/OverviewSection'
import { ConfigSidebar } from './components/ConfigSidebar'
import { exportReportToPdfServer } from './utils/exportPdfServer'
import { ActualSaleSection } from './components/ActualSaleSection'


export default function App() {
    const cfg = useConfigStore(s => s.config)
    const t = useT()

    const [configOpen, setConfigOpen] = useState(false)

    useEffect(() => {
        initUrlSync()
    }, [])

    const toggleConfig = useCallback(() => setConfigOpen(v => !v), [])
    const closeConfig = useCallback(() => setConfigOpen(false), [])
    const handleExportPdf = useCallback(() => exportReportToPdfServer(cfg), [cfg])

    return (
        <div>
            {/* tot ce vrem în PDF este în interiorul lui #report-root */}
            <div id="report-root">
                <SummaryBar />

                <main className="max-w-[1200px] mx-auto px-4 py-6 relative z-10">
                    <Header />

                    {/* Bară de acțiuni sub header: Config (mobil) + Export PDF */}
                    <div className="flex items-center justify-between mt-2 mb-4">
                        {/* Config doar pe mobile / small screens */}
                        <div className="lg:hidden">
                            <button
                                type="button"
                                onClick={toggleConfig}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-800 shadow-sm"
                            >
                                <span>⚙</span>
                                <span>{t('section.config') ?? 'Configuration'}</span>
                            </button>
                        </div>

                        {/* buton Export PDF – vizibil peste tot */}
                        <div className="ml-auto">
                            <button
                                type="button"
                                onClick={handleExportPdf}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-800 shadow-sm"
                            >
                                <span>📄</span>
                                <span>Export PDF</span>
                            </button>
                        </div>
                    </div>

                    {/* Conținutul raportului */}
                    <OverviewSection />

                    <div className="mt-6">
                        <Warnings />
                    </div>

                    <div className="mt-10">
                        <MarketAnalysisSection config={cfg} />
                    </div>

                    <div className="mt-10">
                        <MarketAnalysis />
                    </div>

                    <div className="mt-10">
                        <CostsTaxesSection config={cfg} />
                    </div>

                    <div className="mt-10">
                        <VerificationSection config={cfg} />
                    </div>

                    <div className="mt-10 mb-20">
                        <ActualSaleSection  />
                    </div>

                </main>
            </div>

            {/* OVERLAY pentru sidebar */}
            <AnimatePresence>
                {configOpen && (
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-sm"
                        onClick={closeConfig}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* SIDEBAR configurare (slide-in/out) */}
            <ConfigSidebar
                open={configOpen}
                onClose={closeConfig}
            />

            {/* Buton flotant pentru desktop – toggle config on/off */}
            <button
                type="button"
                onClick={toggleConfig}
                className="hidden lg:flex fixed bottom-6 right-6 z-[100] items-center gap-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 shadow-lg shadow-sky-500/30"
            >
                <span>⚙</span>
                <span>{t('section.config') ?? 'Configuration'}</span>
            </button>
        </div>
    )
}
