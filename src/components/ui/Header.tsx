import { useT } from '../../state/i18nStore'

export function Header() {
  const t = useT()
  const now = new Date().toLocaleString()

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">{t('title.report')}</h1>
      <div className="mt-1 opacity-70 text-sm">
        {t('gen.on')}: {now}
      </div>
    </div>
  )
}

