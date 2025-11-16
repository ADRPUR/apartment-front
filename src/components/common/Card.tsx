import { PropsWithChildren } from 'react'

export function Card({
  title,
  subtitle,
  right,
  children
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
} & PropsWithChildren) {
  return (
    <div className="rounded-xl border bg-white/90 dark:bg-slate-800/90 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="text-xs font-semibold">{title}</h3>
          {subtitle && (
            <div className="text-xs opacity-70">{subtitle}</div>
          )}
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

