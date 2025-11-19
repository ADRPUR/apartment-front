import { useCallback } from 'react'
import { useConfigStore } from '../state/configStore'
import { SummaryBar } from '../components/common/SummaryBar'
import { Header } from '../components/ui/Header'
import { MarketAnalysisSection } from '../components/MarketAnalysisSection'
import { MarketAnalysis } from '../components/MarketAnalysis'
import { exportReportToPdfServer } from '../utils/exportPdfServer'
import { useT } from '../state/i18nStore'

export function MarketAnalysisPage() {
    const cfg = useConfigStore(s => s.config)
    const t = useT()
    const handleExportPdf = useCallback(() => exportReportToPdfServer(cfg), [cfg])

    return (
        <div id="report-root">
            <SummaryBar />

            <main className="max-w-[1200px] mx-auto px-4 py-6 relative z-10">
                <Header />

                {/* Action bar with Export PDF button */}
                <div className="flex items-center justify-end mt-2 mb-4">
                    <button
                        type="button"
                        onClick={handleExportPdf}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-800 shadow-sm"
                    >
                        <span>📄</span>
                        <span>Export PDF</span>
                    </button>
                </div>

                {/* Market Analysis Content */}
                <div className="mt-6">
                    <MarketAnalysisSection config={cfg} />
                </div>

                <div className="mt-10 mb-20">
                    <MarketAnalysis />
                </div>
            </main>
        </div>
    )
}

