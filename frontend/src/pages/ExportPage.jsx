import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportToExcel } from '../api/client';
import ResultsTable from '../components/ResultsTable';

const ExportPage = () => {
  const [results, setResults] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('sigmaResults');
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch (err) { }
    }
  }, []);

  const handleExport = async () => {
    if (!results) return;
    try {
      setDownloading(true);
      await exportToExcel(results);
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setDownloading(false);
    }
  };

  if (!results) {
    return (
      <div className="max-w-screen-2xl mx-auto px-6 py-12 md:px-12 md:py-20 flex flex-col items-center text-center">
        <h1 className="text-display-lg font-headline italic tracking-tight text-primary text-5xl md:text-6xl mb-6">No Data to Export</h1>
        <p className="text-body-lg text-on-surface-variant max-w-lg leading-relaxed text-lg mb-8">
          Complete an analysis workflow through OCR Upload or Manual Entry before generating an Excel report.
        </p>
        <button onClick={() => navigate('/manual')} className="bg-primary text-on-primary rounded-full py-4 px-8 font-label text-md font-semibold hover:bg-primary-container transition-all">
          Go to Manual Entry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-12 md:px-12 md:py-20 flex flex-col gap-16 pb-32">
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <h1 className="text-display-lg font-headline italic tracking-tight text-primary text-6xl md:text-7xl mb-6">
              Export &amp; Share Your Insights
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg leading-relaxed text-lg">
              Transform your clinical data into portable, professional formats. Our Excel Laboratory Matrix preserves every detail for clinical review.
            </p>
          </div>
          <div className="hidden lg:block relative h-64 rounded-xl overflow-hidden shadow-xl rotate-2">
            <img alt="Lab environment" className="w-full h-full object-cover opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsbSqhUgUgj8DEdumz7bP2xqAQdmfAMAMrcIDFr8JCndBmuJ8wn4uqh9lBBrc44_gO51Z99WIlfoyqYPL1gPFFfXtlNkIOwilyf-PuyD7tTwew3YJo2O6-XW7z-goVw_AzkJySMoxVtRIbirLGk0sz54iO9H4aQzheygrj5iPVzttgChDonKoD_GbJBYONd5egxC1e90JgmYcen2i-FewN-TEEdHf5Vip6AqmDk2GC6-dP8nhJUK3Bc4bP7Npf4nyNQHYHqhm7V0vK" />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-5 flex flex-col">
          <div className="bg-surface-container-low rounded-xl p-8 md:p-10 flex-grow shadow-[0_10px_40px_rgba(0,52,43,0.04)] flex flex-col gap-8">
            <div className="flex items-start justify-between">
              <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>table_chart</span>
              </div>
              <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-label uppercase tracking-widest">Premium Export</span>
            </div>
            <div>
              <h2 className="text-3xl font-headline text-primary mb-2">Excel Laboratory Matrix</h2>
              <p className="text-on-surface-variant font-body">Complete biometric synchronization in .xlsx format.</p>
            </div>
            <div className="grid grid-cols-2 gap-6 bg-surface-container-lowest p-6 rounded-lg">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-tighter text-on-surface-variant/60 font-label">Parameters</span>
                <span className="text-xl font-headline italic text-primary">{results.length} Parameters</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-tighter text-on-surface-variant/60 font-label">Generated</span>
                <span className="text-xl font-headline italic text-primary">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
              </div>
            </div>
            <div className="mt-auto">
              <button onClick={handleExport} disabled={downloading} className="w-full bg-primary text-on-primary rounded-full py-5 px-8 font-label text-md font-semibold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg hover:bg-primary-container disabled:opacity-50">
                <span className="material-symbols-outlined">download</span>
                {downloading ? 'Processing...' : 'Download Excel'}
              </button>
              <p className="text-center text-xs text-on-surface-variant mt-4 px-4">
                Secure download. Document valid for clinical consultation.
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-7">
          <ResultsTable results={results} />
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-12">
        <div className="bg-primary-container text-on-primary-container p-10 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-headline italic mb-4 text-on-primary">Collaborative Access</h3>
            <p className="text-on-primary-container/80 text-lg leading-relaxed mb-8">
              Grant temporary secure access to your clinical team. You maintain full sovereignty over your data with time-limited encryption keys.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-on-primary/10 px-4 py-2 rounded-full border border-on-primary/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-fixed"></span>
              <span className="text-sm font-label text-on-primary">Dr. Evelyn Harper</span>
            </div>
            <div className="bg-on-primary/10 px-4 py-2 rounded-full border border-on-primary/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-fixed"></span>
              <span className="text-sm font-label text-on-primary">Metabolic Specialty Clinic</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-high p-10 rounded-xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-3xl font-headline italic mb-4 text-primary">Data Integrity Seal</h3>
            <p className="text-on-surface-variant mb-6">
              Every exported file includes a cryptographically signed Sigma Seal, verifying that the data has not been altered since the laboratory original.
            </p>
            <div className="w-24 h-24 border-2 border-primary/20 rounded-full flex items-center justify-center text-primary group-hover:border-primary/50 transition-all duration-500">
              <span className="material-symbols-outlined text-4xl">verified_user</span>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 scale-150 rotate-12 transition-transform duration-700 group-hover:rotate-0">
            <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExportPage;
