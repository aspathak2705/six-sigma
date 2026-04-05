import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, FileSpreadsheet, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { exportToExcel } from '../api/client'
import PageHeader from '../components/PageHeader'
import ResultsTable from '../components/ResultsTable'

export default function ExportPage() {
  const [results, setResults] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [exported, setExported]   = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = sessionStorage.getItem('sigmaResults')
    if (stored) setResults(JSON.parse(stored))
  }, [])

  const handleExport = async () => {
    if (!results) return
    setExporting(true)
    try {
      await exportToExcel(results)
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    } catch {
      alert('Export failed. Make sure the backend is running.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Export Results"
        subtitle="Download your Sigma analysis as a formatted Excel file"
      >
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost text-sm flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </PageHeader>

      {!results ? (
        <div className="card flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-border flex items-center justify-center mb-5">
            <FileSpreadsheet className="w-8 h-8 text-muted" />
          </div>
          <h2 className="font-display font-bold text-white text-xl mb-2">No results to export</h2>
          <p className="text-subtle text-sm mb-6 font-body">Run an analysis first, then come back to export.</p>
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
          {/* ── Export card ── */}
          <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-jade/10 border border-jade/20 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-jade" />
              </div>
              <div>
                <p className="font-display font-semibold text-white">sigma_analysis.xlsx</p>
                <p className="text-subtle text-sm font-body mt-0.5">
                  {results.length} parameter{results.length !== 1 ? 's' : ''} · CLIA 2024 TEa% · Formatted with colour coding
                </p>
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              {exporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                  Exporting…
                </>
              ) : exported ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Excel
                </>
              )}
            </button>
          </div>

          {/* ── Preview table ── */}
          <div className="card p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-5">
              Preview — {results.length} Parameters
            </h3>
            <ResultsTable results={results} />
          </div>

          {/* ── What's included ── */}
          <div className="card p-5 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <p className="font-display font-semibold text-sm text-white mb-3">
              Excel file includes
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                'Parameter name', 'Report value', 'CV%', 'Bias%',
                'TEa% (CLIA 2024)', 'Sigma (σ)', 'Performance rating', 'Bias method',
              ].map((col) => (
                <div key={col} className="flex items-center gap-2 text-xs text-subtle font-body">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan flex-shrink-0" />
                  {col}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
