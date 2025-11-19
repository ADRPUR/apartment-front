import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { initUrlSync } from './state/urlSync'
import { useT } from './state/i18nStore'
import { ConfigSidebar } from './components/ConfigSidebar'
import { Navigation } from './components/Navigation'
import { MarketAnalysisPage } from './pages/MarketAnalysisPage'
import { CalculatorPage } from './pages/CalculatorPage'


export default function App() {
    const t = useT()
    const [configOpen, setConfigOpen] = useState(false)

    useEffect(() => {
        initUrlSync()
    }, [])

    const toggleConfig = useCallback(() => setConfigOpen(v => !v), [])
    const closeConfig = useCallback(() => setConfigOpen(false), [])

    return (
        <Router>
            <div>
                {/* Navigation bar */}
                <Navigation />

                {/* Config button for mobile */}
                <div className="lg:hidden max-w-[1200px] mx-auto px-4 pt-4">
                    <button
                        type="button"
                        onClick={toggleConfig}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-800 shadow-sm"
                    >
                        <span>⚙</span>
                        <span>{t('section.config') ?? 'Configuration'}</span>
                    </button>
                </div>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<MarketAnalysisPage />} />
                    <Route path="/calculator" element={<CalculatorPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

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
        </Router>
    )
}
