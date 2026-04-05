import { sigmaColor, sigmaEmoji } from '../api/utils'
import clsx from 'clsx'

export default function SigmaBadge({ level, performance, sigma }) {
  const c = sigmaColor(level)
  return (
    <span className={clsx(
      'sigma-badge',
      c.text, c.bg, c.border, 'border'
    )}>
      <span>{sigmaEmoji(level)}</span>
      <span>{performance}</span>
      {sigma !== undefined && (
        <span className="font-mono opacity-80">({Number(sigma).toFixed(2)}σ)</span>
      )}
    </span>
  )
}
