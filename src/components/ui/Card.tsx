import { ReactNode, memo } from 'react'

type CardProps = {
    children: ReactNode
    className?: string
    title?: string
    subtitle?: string
}

export const Card = memo(function Card({ children, className = '', title, subtitle }: CardProps) {
    return (
        <div
            className={`
        rounded-xl
        bg-slate-100 dark:bg-slate-800
        border border-slate-200/70 dark:border-slate-700/70
        shadow-sm
        p-5
        ${className}
      `}
        >
            {(title || subtitle) && (
                <div className="mb-3">
                    {title && (
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            {children}
        </div>
    )
})
