import { NavLink } from 'react-router-dom'
import { useT } from '../state/i18nStore'

export function Navigation() {
    const t = useT()

    return (
        <nav className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="flex space-x-8">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors ${
                                isActive
                                    ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                            }`
                        }
                    >
                        <span>📊</span>
                        <span>Market Analysis</span>
                    </NavLink>
                    <NavLink
                        to="/calculator"
                        className={({ isActive }) =>
                            `py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors ${
                                isActive
                                    ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                            }`
                        }
                    >
                        <span>🧮</span>
                        <span>Calculator</span>
                    </NavLink>
                </div>
            </div>
        </nav>
    )
}

