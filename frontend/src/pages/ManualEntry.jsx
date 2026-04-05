import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart2, RefreshCw, ChevronRight, WifiOff, CheckCircle2 } from 'lucide-react'
import { analyzeManual, getParameters } from '../api/client'
import PageHeader from '../components/PageHeader'
import ResultsTable from '../components/ResultsTable'
import SigmaChart from '../components/SigmaChart'
import clsx from 'clsx'

const DEFAULT_PARAMS = ['WBC', 'RBC', 'HGB', 'HCT', 'MCV', 'MCH', 'MCHC']

const UNITS = {
  WBC: '×10³/µL', RBC: '×10⁶/µL', HGB: 'g/dL',
  HCT: '%', MCV: 'fL', MCH: 'pg', MCHC: 'g/dL', PLT: '×10³/µL',
}

const PLACEHOLDERS = {
  WBC: '4.0–11.0', RBC: '3.5–5.5', HGB: '12.0–17.5',
  HCT: '36–52', MCV: '80–100', MCH: '27–33', MCHC: '32–36', PLT: '150–400',
}

export default function ManualEntry() {
  const [params, setParams]   = useState(DEFAULT_PARAMS)
  const [values, setValues]   = useState(Object.fromEntries(DEFAULT_PARAMS.map(k => [k, ''])))
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [status, setStatus]   = useState('checking')
  const navigate = useNavigate()

  const checkBackend = () => {
    setStatus('checking')
    getParameters()
      .then((p) => {
        setParams(p)
        setValues(Object.fromEntries(p.map(k => [k, ''])))
        setStatus('online')
      })
      .catch(() => setStatus('offline'))
  }

  useEffect(() => { checkBackend() }, [])

  const handleSubmit = async () => {
    if (status === 'offline') {
      setError('Backend is not running. Start it first.')
      return
    }
    const filtered = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && Number(v) > 0)
    )
    if (!Object.keys(filtered).length) {
      setError('Enter at least one parameter value.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await analyzeManual(
        Object.fromEntries(Object.entries(filtered).map(([k, v]) => [k, Number(v)]))
      )
      setResults(data.results)
      sessionStorage.setItem('sigmaResults', JSON.stringify(data.results))
    } catch (e) {
      setError(e.response?.data?.detail || 'Analysis failed. Check backend logs.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setValues(Object.fromEntries(params.map(k => [k, ''])))
    setResults(null)
    setError('')
  }

  return (
    <div>
      <PageHeader title="Manual Entry" subtitle="Enter hematology values directly to compute Sigma metrics">
        {results && (
          <button onClick={() => navigate('/export')} className="btn-ghost text-sm flex items-center gap-2">
            Export Results <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </PageHeader>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Form ── */}
        <div className="card p-6 animate-fade-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Parameter Values</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={checkBackend}
                title="Check backend connection"
                className={clsx(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-display font-semibold border transition-all',
                  status === 'online'
                    ? 'bg-jade/10 border-jade/30 text-jade'
                    : status === 'offline'
                    ? 'bg-coral/10 border-coral/30 text-coral hover:bg-coral/20 cursor-pointer'
                    : 'bg-amber/10 border-amber/30 text-amber'
                )}
              >
                {status === 'online'   && <><CheckCircle2 className="w-3 h-3" /> Connected</>}
                {status === 'offline'  && <><WifiOff className="w-3 h-3" /> Offline — Retry</>}
                {status === 'checking' && <><RefreshCw className="w-3 h-3 animate-spin" /> Checking…</>}
              </button>
              <button onClick={handleReset} className="p-1.5 rounded-lg text-muted hover:text-subtle hover:bg-white/5 transition-colors" title="Reset">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Offline banner */}
          {status === 'offline' && (
            <div className="mb-5 rounded-xl bg-amber/10 border border-amber/30 px-4 py-4 space-y-2">
              <p className="text-amber font-display font-semibold text-sm flex items-center gap-2">
                <WifiOff className="w-4 h-4" /> Backend not running
              </p>
              <p className="text-amber/80 text-xs font-body">
                Open a terminal inside the <code className="font-mono bg-black/20 px-1 rounded">backend/</code> folder and run:
              </p>
              <code className="block font-mono text-xs bg-ink border border-border rounded-lg px-3 py-2.5 text-cyan select-all">
                uvicorn main:app --reload --port 8000
              </code>
              <p className="text-amber/60 text-xs font-body">
                Then click the <strong className="text-amber">Offline — Retry</strong> badge above.
              </p>
            </div>
          )}

          {error && status !== 'offline' && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-sm font-body">
              {error}
            </div>
          )}

          {/* Inputs — always visible */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {params.map((param) => (
              <div key={param}>
                <label className="block text-xs font-display font-semibold text-subtle uppercase tracking-wider mb-1.5">
                  {param}
                  {UNITS[param] && (
                    <span className="ml-1.5 text-muted normal-case font-mono font-normal">{UNITS[param]}</span>
                  )}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={values[param] ?? ''}
                  onChange={(e) => setValues(v => ({ ...v, [param]: e.target.value }))}
                  placeholder={PLACEHOLDERS[param] ?? '0.00'}
                  className="input-field"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || status === 'checking'}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
          >
            {loading    ? <><RefreshCw className="w-4 h-4 animate-spin" /> Calculating…</>
           : status === 'offline' ? <><WifiOff className="w-4 h-4" /> Start Backend First</>
           : <><BarChart2 className="w-4 h-4" /> Generate Sigma Report</>}
          </button>
        </div>

        {/* ── Info Panel ── */}
        <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="card p-5">
            <p className="font-display font-semibold text-sm text-white mb-3">Formula Reference</p>
            <div className="space-y-2 text-sm font-body text-subtle">
              <div className="flex gap-2">
                <span className="text-cyan font-mono text-xs mt-0.5">σ</span>
                <span>= <span className="text-white font-mono">(TEa% − |Bias%|) / CV%</span></span>
              </div>
              <div className="flex gap-2">
                <span className="text-amber font-mono text-xs mt-0.5">B</span>
                <span>= <span className="text-white font-mono">|Assay − Mean| / Mean × 100</span></span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-1.5">
              {[
                ['WBC / RBC / HGB / HCT', 'Predefined Bias% (EQA)'],
                ['MCV / MCH / MCHC',      'Calculated Bias%'],
                ['TEa%',                  'CLIA 2024 (eff. Jan 2025)'],
              ].map(([p, v]) => (
                <div key={p} className="flex justify-between text-xs">
                  <span className="text-muted font-mono">{p}</span>
                  <span className="text-subtle">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="font-display font-semibold text-sm text-white mb-3">CLIA 2024 TEa% Reference</p>
            <div className="space-y-1.5">
              {[['WBC','10%'],['RBC','4%'],['HGB','4%'],['HCT','4%'],['MCV','7%'],['MCH','7%'],['MCHC','7%']].map(([p,t]) => (
                <div key={p} className="flex justify-between text-xs">
                  <span className="font-mono text-subtle">{p}</span>
                  <span className="font-mono text-cyan">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {results && (
        <div className="mt-8 space-y-6 stagger">
          <SigmaChart results={results} />
          <div className="card p-6">
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-5">Analysis Results</h3>
            <ResultsTable results={results} />
          </div>
        </div>
      )}
    </div>
  )
}