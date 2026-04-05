import SigmaBadge from './SigmaBadge'
import { sigmaColor, fmt } from '../api/utils'
import clsx from 'clsx'

const COLS = [
  { key: 'parameter',   label: 'Parameter',    mono: false },
  { key: 'reportValue', label: 'Report Value', mono: true  },
  { key: 'cv',          label: 'CV%',          mono: true  },
  { key: 'bias',        label: 'Bias%',        mono: true  },
  { key: 'tea',         label: 'TEa%',         mono: true  },
  { key: 'sigma',       label: 'Sigma (σ)',    mono: true  },
  { key: 'performance', label: 'Performance',  mono: false },
]

export default function ResultsTable({ results }) {
  if (!results?.length) return null

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-panel">
            {COLS.map((col) => (
              <th
                key={col.key}
                className="px-5 py-3.5 text-left text-xs font-display font-semibold text-muted uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {results.map((row, i) => {
            const c = sigmaColor(row.performanceLevel)
            return (
              <tr
                key={i}
                className="hover:bg-white/[0.02] transition-colors duration-150"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <td className="px-5 py-4">
                  <span className={clsx('font-display font-semibold text-sm', c.text)}>
                    {row.parameter}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-white">
                  {fmt(row.reportValue, 2)}
                </td>
                <td className="px-5 py-4 font-mono text-subtle">
                  {fmt(row.cv, 2)}%
                </td>
                <td className="px-5 py-4">
                  <span className={clsx(
                    'font-mono text-sm',
                    row.bias > row.tea ? 'text-coral font-semibold' : 'text-subtle'
                  )}>
                    {fmt(row.bias, 2)}%
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-subtle">
                  {fmt(row.tea, 1)}%
                </td>
                <td className="px-5 py-4">
                  <span className={clsx('font-mono font-bold text-base', c.text)}>
                    {fmt(row.sigma, 2)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <SigmaBadge
                    level={row.performanceLevel}
                    performance={row.performance}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
