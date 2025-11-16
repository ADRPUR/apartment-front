import { useI18n } from '../../state/i18nStore'

export function LangToggle() {
  const lang = useI18n(s => s.lang)
  const setLang = useI18n(s => s.setLang)

  return (
    <div className="flex items-center gap-2">
      <button
        className={`px-2 py-1 rounded border text-xs ${
          lang === 'en' ? 'bg-sky-100 dark:bg-sky-900/30' : ''
        }`}
        onClick={() => setLang('en')}
        aria-label="Switch language to English"
      >
        EN
      </button>
      <button
        className={`px-2 py-1 rounded border text-xs ${
          lang === 'ro' ? 'bg-sky-100 dark:bg-sky-900/30' : ''
        }`}
        onClick={() => setLang('ro')}
        aria-label="Schimbă limba în română"
      >
        RO
      </button>
    </div>
  )
}

