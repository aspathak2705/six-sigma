import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts'
import { sigmaColor } from '../api/utils'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const c = sigmaColor(d.performanceLevel)
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-card text-sm">
      <p className={`font-display font-bold text-base ${c.text}`}>{d.parameter}</p>
      <p className="text-subtle mt-1">Sigma: <span className={`font-mono font-semibold ${c.text}`}>{Number(d.sigma).toFixed(2)}σ</span></p>
      <p className="text-subtle">Bias: <span className="font-mono text-white">{Number(d.bias).toFixed(2)}%</span></p>
      <p className="text-subtle">CV%: <span className="font-mono text-white">{Number(d.cv).toFixed(2)}%</span></p>
      <p className="text-subtle">TEa%: <span className="font-mono text-white">{Number(d.tea).toFixed(1)}%</span></p>
      <p className={`mt-1.5 font-display text-xs font-semibold ${c.text}`}>{d.performance}</p>
    </div>
  )
}

export default function SigmaChart({ results }) {
  if (!results?.length) return null

  // Reference lines for Sigma thresholds
  const refs = [
    { y: 6, label: '6σ World Class', color: '#00D68F' },
    { y: 5, label: '5σ Excellent',   color: '#00E5FF' },
    { y: 4, label: '4σ Good',        color: '#A78BFA' },
    { y: 3, label: '3σ Marginal',    color: '#FFB347' },
  ]

  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-wider">
        Sigma Performance Chart
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={results} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="parameter"
            tick={{ fill: '#8A9BB5', fontSize: 12, fontFamily: 'Syne' }}
            axisLine={{ stroke: '#1E2D45' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8A9BB5', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          {refs.map((r) => (
            <ReferenceLine
              key={r.y}
              y={r.y}
              stroke={r.color}
              strokeDasharray="4 4"
              strokeOpacity={0.4}
              label={{ value: r.label, fill: r.color, fontSize: 10, fontFamily: 'Syne', position: 'right' }}
            />
          ))}
          <Bar dataKey="sigma" radius={[6, 6, 0, 0]} maxBarSize={56}>
            {results.map((entry, i) => {
              const c = sigmaColor(entry.performanceLevel)
              return <Cell key={i} fill={c.hex} fillOpacity={0.85} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
