import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useConfigStore } from '../state/configStore'
import { fetchRates } from '../services/rates'
import { Card } from './ui/Card'
import { useT } from '../state/i18nStore'
import type { Config } from '../calc/finance'

const schema = z.object({
    new_apartment: z.object({
        address: z.string().optional(),
        price_apartment: z.coerce.number().min(0),
        price_parking: z.coerce.number().min(0),
        include_parking_in_calculation: z.boolean(),
        notary_country: z.enum(['RON', 'MDL', 'EUR']).optional()
    }),
    old_apartment: z.object({
        address: z.string().optional(),
        purchase_price: z.coerce.number().min(0),
        surface_area_sqm: z.coerce.number().min(0).optional(),
        market_price_per_sqm_min: z.coerce.number().min(0).optional(),
        market_price_per_sqm_avg: z.coerce.number().min(0).optional(),
        market_price_per_sqm_max: z.coerce.number().min(0).optional(),
        market_price_per_sqm: z.coerce.number().min(0).optional()
    }),
    exchange_rates: z.object({
        eur_to_mdl: z.coerce.number().min(0),
        eur_to_ron: z.coerce.number().min(0),
        ron_to_mdl: z.coerce.number().min(0)
    }),
    currency_conversion: z
        .object({ enabled: z.boolean().optional() })
        .optional(),
    notary_tax: z
        .object({
            enabled: z.boolean().optional(),
            percentage: z.coerce.number().min(0).optional()
        })
        .optional(),
    agent_fee: z.object({
        enabled: z.boolean(),
        percentage: z.coerce.number().min(0)
    }),
    income_tax: z.object({
        enabled: z.boolean(),
        rate: z.coerce.number().min(0)
    }),
    rental_income: z.object({
        enabled: z.boolean(),
        monthly_amount: z.coerce.number().min(0),
        months_lost: z.coerce.number().min(0)
    })
})

type FormData = z.infer<typeof schema>

export function ConfigForm() {
    const { config, replaceConfig, reset } = useConfigStore()
    const t = useT()

    const [rateMeta, setRateMeta] = useState<{
        date?: string
        eur_to_mdl_label?: string
        eur_to_ron_label?: string
        ron_to_mdl_label?: string
    } | null>(null)

    const {
        register,
        handleSubmit,
        setValue,
        watch
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: config as any,
        mode: 'onChange'
    })

    useEffect(() => {
        const sub = watch(val => {
            try {
                const parsed = schema.parse(val) as Config
                replaceConfig(parsed)
            } catch {
                // ignorăm erorile în timp ce utilizatorul tastează
            }
        })
        return () => sub.unsubscribe()
    }, [watch, replaceConfig])

    const fld =
        'border rounded px-3 py-2 w-full bg-white/90 dark:bg-slate-900/30 text-xs'
    const lbl = 'text-xs opacity-80'
    const help = 'text-xs opacity-60 mt-1'

    const wrap = (children: any, unit?: string) => (
        <div className="relative">
            {children}
            {unit && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-60">
          {unit}
        </span>
            )}
        </div>
    )

    return (
        <form
            onSubmit={handleSubmit(() => {})}
            className="grid gap-6"
            id="config-form"
        >
            <div className="grid lg:grid-cols-1 gap-6">
                {/* New apartment */}
                <Card
                    title={t('card.new')}
                    subtitle={t('card.new.sub')}
                >
                    <div className="grid gap-3">
                        <div>
                            <label className={lbl}>{t('label.address')}</label>
                            <input
                                className={fld}
                                {...register('new_apartment.address')}
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                                <label className={lbl}>
                                    {t('label.apartmentPrice')}
                                </label>
                                {wrap(
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={fld}
                                        {...register('new_apartment.price_apartment')}
                                    />,
                                    'EUR'
                                )}
                            </div>
                            <div>
                                <label className={lbl}>
                                    {t('label.parkingPrice')}
                                </label>
                                {wrap(
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={fld}
                                        {...register('new_apartment.price_parking')}
                                    />,
                                    'EUR'
                                )}
                                <div className={help}>{t('help.parking')}</div>
                            </div>
                        </div>

                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register(
                                    'new_apartment.include_parking_in_calculation'
                                )}
                            />
                            <span className={lbl}>{t('label.includeParking')}</span>
                        </label>

                        <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                                <label className={lbl}>
                                    {t('label.notaryCountry')}
                                </label>
                                <select
                                    className={fld}
                                    {...register('new_apartment.notary_country')}
                                >
                                    <option value="RON">Romania (RON)</option>
                                    <option value="MDL">Moldova (MDL)</option>
                                    <option value="EUR">EU (EUR)</option>
                                </select>
                            </div>
                            <div>
                                <label className={lbl}>
                                    {t('label.notaryPct')}
                                </label>
                                {wrap(
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={fld}
                                        {...register('notary_tax.percentage')}
                                    />,
                                    '%'
                                )}
                            </div>
                        </div>

                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('notary_tax.enabled')}
                            />
                            <span className={lbl}>{t('label.notaryEnabled')}</span>
                        </label>
                    </div>
                </Card>

                {/* Old apartment */}
                <Card
                    title={t('card.old')}
                    subtitle={t('card.old.sub')}
                >
                    <div className="grid gap-3">
                        <div>
                            <label className={lbl}>{t('label.address')}</label>
                            <input
                                className={fld}
                                {...register('old_apartment.address')}
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                                <label className={lbl}>
                                    {t('label.purchasePrice')}
                                </label>
                                {wrap(
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={fld}
                                        {...register('old_apartment.purchase_price')}
                                    />,
                                    'EUR'
                                )}
                            </div>
                            <div>
                                <label className={lbl}>{t('label.surface')}</label>
                                {wrap(
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={fld}
                                        {...register('old_apartment.surface_area_sqm')}
                                    />,
                                    t('label.sqm')
                                )}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-3">
                            <div>
                                <label className={lbl}>
                                    {t('label.perSqmMin')}
                                </label>
                                {wrap(
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={fld}
                                        {...register(
                                            'old_apartment.market_price_per_sqm_min'
                                        )}
                                    />,
                                    'EUR'
                                )}
                            </div>
                            <div>
                                <label className={lbl}>
                                    {t('label.perSqmAvg')}
                                </label>
                                {wrap(
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={fld}
                                        {...register(
                                            'old_apartment.market_price_per_sqm_avg'
                                        )}
                                    />,
                                    'EUR'
                                )}
                            </div>
                            <div>
                                <label className={lbl}>
                                    {t('label.perSqmMax')}
                                </label>
                                {wrap(
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={fld}
                                        {...register(
                                            'old_apartment.market_price_per_sqm_max'
                                        )}
                                    />,
                                    'EUR'
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Exchange rates */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {t('section.exchange')}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {t('section.exchange.sub') ?? ''}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="border rounded px-3 py-1 text-xs"
                        onClick={async () => {
                            try {
                                const r = await fetchRates()

                                // setăm cursurile în formular
                                setValue('exchange_rates.eur_to_ron', r.eur_to_ron)
                                setValue('exchange_rates.eur_to_mdl', r.eur_to_mdl)
                                setValue('exchange_rates.ron_to_mdl', r.ron_to_mdl)

                                // meta-info locală pentru afișare sub câmpuri
                                setRateMeta({
                                    date: r.date,
                                    eur_to_mdl_label: r.eur_to_mdl_label,
                                    eur_to_ron_label: r.eur_to_ron_label,
                                    ron_to_mdl_label: r.ron_to_mdl_label
                                })

                                // dacă vrei să mai ai și global:
                                ;(window as any).__rateMeta = {
                                    date: r.date,
                                    eur_to_mdl_label: r.eur_to_mdl_label,
                                    eur_to_ron_label: r.eur_to_ron_label,
                                    ron_to_mdl_label: r.ron_to_mdl_label
                                }

                                alert(
                                    `Rates loaded for ${r.date}.\n` +
                                    `EUR→MDL: ${r.eur_to_mdl_label}\n` +
                                    `EUR→RON: ${r.eur_to_ron_label}\n` +
                                    `RON→MDL: ${r.ron_to_mdl_label}`
                                )
                            } catch (e: any) {
                                alert(
                                    'Could not load rates automatically. Enter them manually.\n' +
                                    (e?.message || '')
                                )
                            }
                        }}
                    >
                        {t('btn.autoRates')}
                    </button>


                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                        <label className={lbl}>{t('label.eurMdl')}</label>
                        {wrap(
                            <input
                                type="number"
                                step="0.0001"
                                className={fld}
                                {...register('exchange_rates.eur_to_mdl')}
                            />
                        )}
                        <div className={help}>
                            {rateMeta?.eur_to_mdl_label
                                ? rateMeta.eur_to_mdl_label
                                : t('help.manualRate') ?? 'Enter manually or click "Auto rates".'}
                        </div>
                    </div>
                    <div>
                        <label className={lbl}>{t('label.eurRon')}</label>
                        {wrap(
                            <input
                                type="number"
                                step="0.0001"
                                className={fld}
                                {...register('exchange_rates.eur_to_ron')}
                            />
                        )}
                        <div className={help}>
                            {rateMeta?.eur_to_ron_label
                                ? rateMeta.eur_to_ron_label
                                : t('help.manualRate') ?? 'Enter manually or click "Auto rates".'}
                        </div>
                    </div>
                    <div>
                        <label className={lbl}>{t('label.ronMdl')}</label>
                        {wrap(
                            <input
                                type="number"
                                step="0.0001"
                                className={fld}
                                {...register('exchange_rates.ron_to_mdl')}
                            />
                        )}
                        <div className={help}>
                            {rateMeta?.ron_to_mdl_label
                                ? rateMeta.ron_to_mdl_label
                                : t('help.manualRate') ?? 'Enter manually or click "Auto rates".'}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Agent & Tax */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                {t('section.agent')}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {t('section.agent.sub') ?? ''}
                            </div>
                        </div>
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('agent_fee.enabled')}
                            />
                            <span className={lbl}>{t('label.enabled')}</span>
                        </label>
                    </div>

                    <div className="grid sm:grid-cols-[1fr_auto] gap-3 max-w-md">
                        <div>
                            <label className={lbl}>{t('label.agentPct')}</label>
                            {wrap(
                                <input
                                    type="number"
                                    step="0.01"
                                    className={fld}
                                    {...register('agent_fee.percentage')}
                                />,
                                '%'
                            )}
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                {t('section.tax')}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {t('section.tax.sub') ?? ''}
                            </div>
                        </div>
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('income_tax.enabled')}
                            />
                            <span className={lbl}>{t('label.enabled')}</span>
                        </label>
                    </div>

                    <div className="max-w-md">
                        <label className={lbl}>
                            {t('label.incomeTaxPct')}
                        </label>
                        {wrap(
                            <input
                                type="number"
                                step="0.01"
                                className={fld}
                                {...register('income_tax.rate')}
                            />,
                            '%'
                        )}
                        <div className={help}>{t('help.incomeTax')}</div>
                    </div>
                </Card>
            </div>

            {/* Rent + Conversion */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                {t('section.rent')}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {t('section.rent.sub') ?? ''}
                            </div>
                        </div>
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('rental_income.enabled')}
                            />
                            <span className={lbl}>{t('label.enabled')}</span>
                        </label>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
                        <div>
                            <label className={lbl}>
                                {t('label.rentPerMonth')}
                            </label>
                            {wrap(
                                <input
                                    type="number"
                                    step="0.01"
                                    className={fld}
                                    {...register('rental_income.monthly_amount')}
                                />,
                                'EUR'
                            )}
                        </div>
                        <div>
                            <label className={lbl}>
                                {t('label.monthsLost')}
                            </label>
                            {wrap(
                                <input
                                    type="number"
                                    step="1"
                                    className={fld}
                                    {...register('rental_income.months_lost')}
                                />,
                                'mo'
                            )}
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                {t('section.conv')}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {t('section.conv.sub') ?? ''}
                            </div>
                        </div>
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('currency_conversion.enabled')}
                            />
                            <span className={lbl}>{t('label.enabled')}</span>
                        </label>
                    </div>

                    <div className={help}>{t('help.conv')}</div>
                </Card>
            </div>

            {/* bottom buttons */}
            <div className="flex gap-3 pb-20 text-xs">
                <button
                    className="border rounded px-3 py-2"
                    type="button"
                    onClick={() => reset()}
                >
                    {t('btn.reset')}
                </button>

                <button
                    className="border rounded px-3 py-2"
                    type="button"
                    onClick={() => {
                        const blob = new Blob(
                            [JSON.stringify(config, null, 2)],
                            { type: 'application/json' }
                        )
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'config.json'
                        a.click()
                        URL.revokeObjectURL(url)
                    }}
                >
                    {t('btn.export')}
                </button>

                <label className="border rounded px-3 py-2 cursor-pointer">
                    {t('btn.import')}
                    <input
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={e => {
                            const f = e.target.files?.[0]
                            if (!f) return
                            f.text().then(txt => {
                                try {
                                    const json = JSON.parse(txt)
                                    const parsed = schema.parse(json) as Config
                                    replaceConfig(parsed)
                                    alert('Config imported.')
                                } catch (err: any) {
                                    alert('Invalid JSON: ' + (err?.message || ''))
                                }
                            })
                        }}
                    />
                </label>
            </div>
        </form>
    )
}
