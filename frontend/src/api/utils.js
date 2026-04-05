/** Return Tailwind colour tokens for a given performance level */
export function sigmaColor(level) {
  const map = {
    'world-class': { text: 'text-jade',   bg: 'bg-jade/10',   border: 'border-jade/30',   hex: '#00D68F' },
    'excellent':   { text: 'text-cyan',   bg: 'bg-cyan/10',   border: 'border-cyan/30',   hex: '#00E5FF' },
    'good':        { text: 'text-violet', bg: 'bg-violet/10', border: 'border-violet/30', hex: '#A78BFA' },
    'marginal':    { text: 'text-amber',  bg: 'bg-amber/10',  border: 'border-amber/30',  hex: '#FFB347' },
    'poor':        { text: 'text-coral',  bg: 'bg-coral/10',  border: 'border-coral/30',  hex: '#FF6B6B' },
  }
  return map[level] ?? map['poor']
}

export function sigmaEmoji(level) {
  const map = {
    'world-class': '🌟',
    'excellent':   '✅',
    'good':        '✔️',
    'marginal':    '⚠️',
    'poor':        '❌',
  }
  return map[level] ?? '—'
}

/** Format a number to fixed decimals, fallback to '—' */
export function fmt(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return '—'
  return Number(val).toFixed(decimals)
}
