import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, TrendingUp, AlertTriangle, CheckCircle, FlaskConical } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import SigmaChart from '../components/SigmaChart'
import ResultsTable from '../components/ResultsTable'
import SigmaBadge from '../components/SigmaBadge'

export default function Dashboard() {
  const [results, setResults] = useState(null)
  const navigate = useNavigate()

  // Load last results from sessionStorage (shared across pages)
  useEffect(() => {
    const stored = sessionStorage.getItem('sigmaResults')
    if (stored) setResults(JSON.parse(stored))
  }, [])

  const stats = results
    ? {
        total:     results.length,
        poor:      results.filter((r) => r.performanceLevel === 'poor').length,
        good:      results.filter((r) => ['good','excellent','world-class'].includes(r.performanceLevel)).length,
        avgSigma:  (results.reduce((s, r) => s + r.sigma, 0) / results.length).toFixed(2),
      }
    : null

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Six Sigma performance overview for hematology QC"
      >
        <button onClick={() => navigate('/manual')} className="btn-primary text-sm">
          + New Analysis
        </button>
      </PageHeader>

      {!results ? (
        /* ── Empty state ── */
        <div className="card flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-5 animate-pulse-glow">
            <FlaskConical className="w-8 h-8 text-cyan" />
          </div>
          <h2 className="font-display font-bold text-white text-xl mb-2">No analysis yet</h2>
          <p className="text-subtle text-sm mb-6 max-w-sm font-body">
            Run an analysis via Manual Entry or OCR Upload. Results will appear here automatically.
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/manual')} className="btn-primary text-sm">
              Manual Entry
            </button>
            <button onClick={() => navigate('/upload')} className="btn-ghost text-sm">
              OCR Upload
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 stagger">
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Parameters"
              value={stats.total}
              sub="analyzed"
              accent="cyan"
              icon={Activity}
            />
            <StatCard
              label="Avg Sigma"
              value={`${stats.avgSigma}σ`}
              sub="across all params"
              accent="violet"
              icon={TrendingUp}
            />
            <StatCard
              label="Poor"
              value={stats.poor}
              sub="need immediate review"
              accent="coral"
              icon={AlertTriangle}
            />
            <StatCard
              label="Acceptable"
              value={stats.good}
              sub="within goals"
              accent="jade"
              icon={CheckCircle}
            />
          </div>

          {/* ── Chart ── */}
          <SigmaChart results={results} />

          {/* ── Table ── */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
                Parameter Results
              </h3>
              <div className="flex gap-2 flex-wrap justify-end">
                {['world-class','excellent','good','marginal','poor'].map((l) => (
                  <SigmaBadge key={l} level={l} performance={l.replace('-',' ')} />
                ))}
              </div>
            </div>
            <ResultsTable results={results} />
          </div>

          {/* ── Sigma scale reference ── */}
          <div className="card p-5">
            <p className="font-display font-semibold text-sm text-muted uppercase tracking-wider mb-4">
              Sigma Scale Reference
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-body">
              {[
                { range: '≥ 6σ', label: 'World Class', level: 'world-class', desc: 'Exceptional — minimal QC needed' },
                { range: '5–6σ', label: 'Excellent',   level: 'excellent',   desc: 'Very high quality' },
                { range: '4–5σ', label: 'Good',        level: 'good',        desc: 'Acceptable performance' },
                { range: '3–4σ', label: 'Marginal',    level: 'marginal',    desc: 'Needs tighter QC rules' },
                { range: '< 3σ', label: 'Poor',        level: 'poor',        desc: 'Review method immediately' },
              ].map((s) => (
                <SigmaBadge key={s.level} level={s.level} performance={`${s.range} — ${s.label}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
