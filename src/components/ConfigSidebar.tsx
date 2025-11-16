import { AnimatePresence, motion } from 'framer-motion'
import { ConfigForm } from './ConfigForm'
import { Presets } from './Presets'
import { PresetBadge } from './PresetBadge'
import { useT } from '../state/i18nStore'

type Props = {
    open: boolean
    onClose: () => void
}

export function ConfigSidebar({ open, onClose }: Props) {
    const t = useT()

    return (
        <AnimatePresence>
            {open && (
                <motion.aside
                    key="config-sidebar"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.25 }}
                    className="
            fixed inset-y-0 right-0 z-[100]
            w-full sm:w-[420px] lg:w-[480px]
            border-l border-slate-200 dark:border-slate-700
            bg-slate-100 dark:bg-slate-800 backdrop-blur
            shadow-2xl
            flex flex-col
          "
                    aria-label="Live configuration panel"
                >
                    {/* Header sidebar */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90">
                        <div className="pr-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-sky-500">
                                {t('section.config') ?? 'Configuration (live)'}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Edit values and see the report update instantly.
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            aria-label="Close configuration panel"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Preset controls */}
                    <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/70">
                        <PresetBadge />
                        <Presets />
                    </div>

                    {/* Scrollable form area */}
                    <div className="flex-1 overflow-y-auto px-5 py-4">
                        <div className="space-y-6">
                            <ConfigForm />
                        </div>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    )
}
