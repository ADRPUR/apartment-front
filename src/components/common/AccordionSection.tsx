import { useState, PropsWithChildren, memo } from 'react'

export const AccordionSection = memo(function AccordionSection({
  title,
  children
}: PropsWithChildren<{ title: string }>) {
  const [open, setOpen] = useState(true)

  return (
    <section className="rounded-xl border p-3 bg-white/90 dark:bg-slate-900/30">
      <div className="flex items-center justify-between px-2 py-1">
        <h3 className="font-semibold">{title}</h3>
        <button
          className="text-sm underline"
          onClick={() => setOpen(o => !o)}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      {open && <div className="mt-3">{children}</div>}
    </section>
  )
})

