import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Activity, Upload, ClipboardList, Download, FlaskConical } from 'lucide-react'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import ManualEntry from './pages/ManualEntry'
import OCRUpload from './pages/OCRUpload'
import ExportPage from './pages/ExportPage'
import clsx from 'clsx'

const NAV = [
  { to: '/',        label: 'Dashboard',    icon: Activity },
  { to: '/manual',  label: 'Manual Entry', icon: ClipboardList },
  { to: '/upload',  label: 'OCR Upload',   icon: Upload },
  { to: '/export',  label: 'Export',       icon: Download },
]

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-ink">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={clsx(
        'fixed top-0 left-0 z-30 h-full w-64 bg-panel border-r border-border',
        'flex flex-col transition-transform duration-300 ease-in-out',
        'lg:translate-x-0 lg:static lg:z-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center animate-pulse-glow">
              <FlaskConical className="w-5 h-5 text-cyan" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-base leading-tight">Sigma Lab</p>
              <p className="text-muted text-xs font-body">Hematology Analyzer</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-display font-medium transition-all duration-200',
                isActive
                  ? 'bg-cyan/10 text-cyan border border-cyan/20 shadow-glow-sm'
                  : 'text-subtle hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <p className="text-xs text-muted font-body">
            TEa source: <span className="text-subtle">CLIA 2024</span>
          </p>
          <p className="text-xs text-muted mt-0.5">σ = (TEa − Bias) / CV%</p>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-border bg-panel">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-subtle hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-cyan" />
            <span className="font-display font-bold text-white text-sm">Sigma Lab</span>
          </div>
          <div className="w-9" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Routes>
            <Route path="/"       element={<Dashboard />} />
            <Route path="/manual" element={<ManualEntry />} />
            <Route path="/upload" element={<OCRUpload />} />
            <Route path="/export" element={<ExportPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
