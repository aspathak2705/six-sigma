import React, { useState, useEffect } from 'react';
import { getParameters, analyzeManual } from '../api/client';
import ResultsTable from '../components/ResultsTable';

const DEFAULT_PARAMS = ["WBC", "RBC", "HGB", "HCT", "MCV", "MCH", "MCHC", "PLT"];
const PLACEHOLDERS = { WBC: 'e.g. 7.5', RBC: 'e.g. 4.8', HGB: 'e.g. 14.2', HCT: 'e.g. 42.5', MCV: 'e.g. 90', MCH: 'e.g. 29.5', MCHC: 'e.g. 34.0', PLT: 'e.g. 250' };
const UNITS = { WBC: 'x10³/µL', RBC: 'x10⁶/µL', HGB: 'g/dL', HCT: '%', MCV: 'fL', MCH: 'pg', MCHC: 'g/dL', PLT: 'x10³/µL' };

const ManualEntry = () => {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [values, setValues] = useState({});
  const [status, setStatus] = useState('checking'); 
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      setStatus('checking');
      try {
        const data = await getParameters();
        setParams(data.parameters || DEFAULT_PARAMS);
        setStatus('online');
      } catch (err) {
        setParams(DEFAULT_PARAMS);
        setStatus('offline');
      }
    };
    checkBackend();
  }, []);

  const handleChange = (p, val) => {
    setValues(prev => ({ ...prev, [p]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filtered = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== '' && Number(v) > 0)
    );
    if (Object.keys(filtered).length === 0) return;
    
    setLoading(true);
    try {
      const data = await analyzeManual(filtered);
      setResults(data.results);
      sessionStorage.setItem('sigmaResults', JSON.stringify(data.results));
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (err) {
      alert('Analysis failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-24 text-on-surface">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm ${status === 'online' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
              <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-[#00342b] animate-pulse' : 'bg-outline-variant'}`}></span>
              <span className="text-[11px] font-bold tracking-widest uppercase">{status === 'online' ? 'Connected' : status === 'offline' ? 'Offline' : 'Checking...'}</span>
            </div>
            <span className="text-on-surface-variant/60 text-sm italic">Sigma Backend Status</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-light italic tracking-tight text-primary mb-6 md:mb-8 serif-editorial">Manual Entry</h2>
          <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed mb-10">
            Precision input for hematology metrics. Ensure all values align with standard calibration before final submission to the analyzer core.
          </p>
          <button onClick={handleSubmit} disabled={loading || Object.keys(values).length === 0} className="w-full md:w-auto bg-primary text-on-primary px-6 md:px-10 py-4 md:py-5 rounded-full font-bold text-lg hover:bg-primary-container transition-all active:scale-95 shadow-xl shadow-primary/10 disabled:opacity-50">
            {loading ? 'Processing...' : 'Submit to Core Analyzer'}
          </button>
        </div>
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative group">
            <img alt="Laboratory detail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn3t0m5FoNTuzTG11xKKfEOr8hgAlXLxYuVML-mUKSwq6FSjTJVhDE7LWZ5MU5r-0Pu3wc82Z0Ru50-lU9hmojrzvBUMCzzvb4dOrn11Yr0iavQpIXOY2hgG1mM9_MVDb8ZcClj8Vf9TRiTY3EPPISQL43fnj_r-CZ4NI2gH7xYa2NO0-bzgwzLYyDrGSlwioJSbyBX8dGNfyAc3fJmJtTNy4EcZSi7CBnXu09iCneFanuveamSgcpMXBgMoYpDIy6uEnhUvfM0TA-" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 glass-panel p-6 rounded-lg">
              <p className="text-primary font-headline italic text-2xl serif-editorial">Accuracy is the foundation of trust.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-12 items-start mb-16 md:mb-24">
        <form onSubmit={handleSubmit} className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {params.map((p, idx) => (
            <div key={p} className="bg-surface-container-low p-8 rounded-xl flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-primary">{p}</h3>
                <span className="material-symbols-outlined text-primary/40">science</span>
              </div>
              <div className="relative">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">Value ({UNITS[p] || ''})</label>
                <input
                  type="number"
                  step="any"
                  value={values[p] || ''}
                  onChange={(e) => handleChange(p, e.target.value)}
                  placeholder={PLACEHOLDERS[p] || '0.0'}
                  className="w-full bg-surface-container-highest border-none rounded-lg p-5 text-xl font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/30 text-on-surface outline-none"
                />
              </div>
            </div>
          ))}
        </form>

        <aside className="xl:sticky xl:top-32 space-y-8">
          <div className="bg-primary text-on-primary p-10 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-[120px]">verified_user</span>
            </div>
            <h3 className="text-3xl font-headline italic mb-6 relative z-10 serif-editorial">CLIA 2024 TEa% Benchmarks</h3>
            <div className="space-y-6 relative z-10">
              {['WBC:15.0', 'RBC:6.0', 'HGB:7.0', 'HCT:6.0', 'PLT:25.0'].map(val => {
                const [param, num] = val.split(':');
                return (
                  <div key={param} className="flex justify-between items-center border-b border-on-primary/10 pb-4">
                    <span className="font-bold tracking-wide uppercase text-[10px] opacity-70">{param}</span>
                    <span className="text-2xl font-light">± {num}%</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-8 text-[11px] font-medium text-on-primary/50 leading-relaxed italic">
              *Total Allowable Error (TEa) limits as per recent CMS updates.
            </p>
          </div>
          <div className="bg-surface-container-highest p-8 rounded-xl">
            <h4 className="text-primary font-bold text-sm uppercase tracking-widest mb-4">Quality Check</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                <span className="text-sm text-on-surface-variant">Data verified across boundaries.</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {results && <ResultsTable results={results} />}
    </div>
  );
};

export default ManualEntry;
