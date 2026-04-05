import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Image, AlertCircle, CheckCircle2, X, ChevronRight } from 'lucide-react'
import { uploadReport } from '../api/client'
import PageHeader from '../components/PageHeader'
import ResultsTable from '../components/ResultsTable'
import SigmaChart from '../components/SigmaChart'
import clsx from 'clsx'

const ACCEPT = '.pdf,.png,.jpg,.jpeg,.txt'
const MAX_MB = 10

function FileIcon({ type }) {
  if (type?.includes('pdf'))   return <FileText className="w-8 h-8 text-coral" />
  if (type?.startsWith('image')) return <Image className="w-8 h-8 text-cyan" />
  return <FileText className="w-8 h-8 text-subtle" />
}

export default function OCRUpload() {
  const [file, setFile]         = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [results, setResults]   = useState(null)
  const [extracted, setExtracted] = useState(null)
  const [textPreview, setTextPreview] = useState('')
  const [error, setError]       = useState('')
  const inputRef = useRef()
  const navigate = useNavigate()

  const handleFile = (f) => {
    if (!f) return
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`File too large. Max ${MAX_MB}MB.`)
      return
    }
    setFile(f)
    setError('')
    setResults(null)
    setExtracted(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const data = await uploadReport(file)
      setResults(data.results)
      setExtracted(data.extractedValues)
      setTextPreview(data.extractedText || '')
      sessionStorage.setItem('sigmaResults', JSON.stringify(data.results))
    } catch (e) {
      setError(e.response?.data?.detail || 'Upload failed. Check backend connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setResults(null)
    setExtracted(null)
    setError('')
    setTextPreview('')
  }

  return (
    <div>
      <PageHeader
        title="OCR Upload"
        subtitle="Upload a lab report (PDF / image / text) to extract and analyze parameters automatically"
      >
        {results && (
          <button onClick={() => navigate('/export')} className="btn-ghost text-sm flex items-center gap-2">
            Export Results <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </PageHeader>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Drop zone ── */}
        <div className="space-y-4 animate-fade-up">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
            className={clsx(
              'relative card border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer',
              'flex flex-col items-center justify-center text-center py-14 px-8',
              dragging
                ? 'border-cyan bg-cyan/5 shadow-glow'
                : file
                ? 'border-border cursor-default'
                : 'border-border hover:border-cyan/50 hover:bg-cyan/[0.02]'
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {!file ? (
              <>
                <div className={clsx(
                  'w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 transition-all',
                  dragging
                    ? 'bg-cyan/15 border-cyan/40 shadow-glow'
                    : 'bg-white/5 border-border'
                )}>
                  <Upload className={clsx('w-7 h-7', dragging ? 'text-cyan' : 'text-muted')} />
                </div>
                <p className="font-display font-semibold text-white text-base mb-1">
                  {dragging ? 'Drop it here' : 'Drop your report here'}
                </p>
                <p className="text-subtle text-sm font-body mb-4">or click to browse</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {['PDF', 'PNG', 'JPG', 'TXT'].map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 border border-border text-xs font-mono text-muted">
                      .{t.toLowerCase()}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted mt-3 font-body">Max {MAX_MB}MB</p>
              </>
            ) : (
              <div className="w-full">
                <div className="flex items-center gap-4">
                  <FileIcon type={file.type} />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-display font-semibold text-white text-sm truncate">{file.name}</p>
                    <p className="text-muted text-xs font-body mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB · {file.type || 'unknown type'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove() }}
                    className="p-1.5 rounded-lg text-muted hover:text-coral hover:bg-coral/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {results && (
                  <div className="mt-4 flex items-center gap-2 text-jade text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-display font-semibold">Analysis complete</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-coral/10 border border-coral/30 text-sm">
              <AlertCircle className="w-4 h-4 text-coral mt-0.5 flex-shrink-0" />
              <span className="text-coral font-body">{error}</span>
            </div>
          )}

          {file && !results && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                  Extracting & Analyzing…
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Analyze Report
                </>
              )}
            </button>
          )}
        </div>

        {/* ── Extracted values + text preview ── */}
        <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {extracted && (
            <div className="card p-5">
              <p className="font-display font-semibold text-sm text-white mb-3">
                Extracted Values
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(extracted).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center px-3 py-2 rounded-lg bg-ink border border-border">
                    <span className="font-mono text-xs text-subtle">{k}</span>
                    <span className="font-mono text-sm text-cyan font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {textPreview && (
            <div className="card p-5">
              <p className="font-display font-semibold text-sm text-white mb-3">
                OCR Text Preview
              </p>
              <pre className="text-xs font-mono text-muted whitespace-pre-wrap leading-relaxed bg-ink rounded-xl p-3 border border-border max-h-48 overflow-y-auto">
                {textPreview}
              </pre>
            </div>
          )}

          {!extracted && (
            <div className="card p-5 text-center text-muted text-sm font-body">
              <p>Extracted parameters and OCR preview will appear here after upload.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      {results && (
        <div className="mt-8 space-y-6 stagger">
          <SigmaChart results={results} />
          <div className="card p-6">
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-5">
              Analysis Results
            </h3>
            <ResultsTable results={results} />
          </div>
        </div>
      )}
    </div>
  )
}
