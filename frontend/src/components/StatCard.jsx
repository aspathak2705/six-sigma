import clsx from 'clsx'

export default function StatCard({ label, value, sub, accent = 'cyan', icon: Icon }) {
  const accents = {
    cyan:   'text-cyan  border-cyan/20  bg-cyan/5',
    jade:   'text-jade  border-jade/20  bg-jade/5',
    coral:  'text-coral border-coral/20 bg-coral/5',
    amber:  'text-amber border-amber/20 bg-amber/5',
    violet: 'text-violet border-violet/20 bg-violet/5',
  }
  return (
    <div className="card p-5 flex items-start gap-4">
      {Icon && (
        <div className={clsx('w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0', accents[accent])}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-display font-medium text-muted uppercase tracking-wider">{label}</p>
        <p className={clsx('text-2xl font-display font-bold mt-0.5', `text-${accent === 'cyan' ? 'white' : accent}`)}>{value}</p>
        {sub && <p className="text-xs text-muted mt-0.5 font-body">{sub}</p>}
      </div>
    </div>
  )
}
