import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { useConfigStore } from '../state/configStore'
import { useCalculation } from '../hooks/useCalculation'
import { COLORS } from '../constants'

export function CostBreakdown() {
  const cfg = useConfigStore(s => s.config)
  const r = useCalculation(cfg)

  if (r?.error) return null

  const agent = r.agentFee
  const tax = r.tax
  const lost =
    cfg.rental_income.enabled
      ? cfg.rental_income.monthly_amount *
        cfg.rental_income.months_lost
      : 0
  const conv = r.convCost
  const net = r.net

  const data = [
    { name: 'Agent fee', value: agent },
    { name: 'Conversion', value: conv },
    { name: 'Income tax', value: tax },
    { name: 'Net (after fees)', value: Math.max(net, 0) }
  ].filter(d => d.value > 0)

  if (!data.length) return null

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="p-3 font-semibold bg-slate-50 dark:bg-slate-800">
        Cost breakdown
      </div>
      <div
        className="h-64 p-3"
        role="img"
        aria-label="Pie chart of cost breakdown"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS.CHART[index % COLORS.CHART.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: any, n: any) => [
                `${Number(v).toFixed(2)}`,
                n
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

