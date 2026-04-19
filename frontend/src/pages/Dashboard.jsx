import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SigmaChart from '../components/SigmaChart';
import ResultsTable from '../components/ResultsTable';

const Dashboard = () => {
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('sigmaResults');
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch (err) { }
    }
  }, []);

  if (!results) {
    return (
      <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto min-h-[70vh] flex flex-col justify-center items-center text-center">
        <h1 className="serif-editorial text-5xl md:text-7xl font-light italic text-primary leading-tight tracking-tight mb-4">
          Welcome to Sigma
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl font-body leading-relaxed mb-10">
          Your diagnostic analytics hub. Upload a document or manually enter parameters to visualize the system.
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/upload')} className="bg-primary hover:bg-primary-container text-on-primary rounded-full px-8 py-3 font-semibold transition-colors shadow-lg active:scale-95">
            Upload Report
          </button>
          <button onClick={() => navigate('/manual')} className="bg-surface border border-outline-variant hover:bg-surface-variant text-primary rounded-full px-8 py-3 font-semibold transition-colors active:scale-95">
            Manual Entry
          </button>
        </div>
      </div>
    );
  }

  const totalParams = results.length;
  const avgSigma = results.reduce((acc, curr) => acc + Number(curr.sigma || 0), 0) / (totalParams || 1);
  const poorCount = results.filter(r => r.performanceLevel?.toLowerCase() === 'poor').length;
  const accCount = totalParams - poorCount;

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
      <section className="mb-16">
        <h1 className="serif-editorial text-5xl md:text-7xl font-light italic text-primary leading-tight tracking-tight mb-4">
          System Overview
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl font-body leading-relaxed">
          Your latest laboratory diagnostics have been synthesized. We've mapped {totalParams} biological parameters into your personalized Sigma scale for clinical clarity.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48 group hover:bg-surface-container transition-all duration-500">
          <span className="label-md uppercase tracking-widest text-on-surface-variant/60 text-xs font-bold font-label">Total Parameters</span>
          <span className="serif-editorial text-6xl text-primary font-light">{totalParams}</span>
        </div>
        <div className="bg-primary p-8 rounded-xl flex flex-col justify-between h-48 shadow-lg">
          <span className="label-md uppercase tracking-widest text-on-primary-fixed-variant text-xs font-bold font-label">Avg Sigma</span>
          <div className="flex items-baseline gap-2">
            <span className="serif-editorial text-6xl text-surface font-light">{avgSigma.toFixed(1)}</span>
            <span className="text-on-primary-container text-sm">Optimal Range</span>
          </div>
        </div>
        <div className="bg-tertiary-fixed p-8 rounded-xl flex flex-col justify-between h-48">
          <span className="label-md uppercase tracking-widest text-on-tertiary-fixed-variant text-xs font-bold font-label">Poor</span>
          <div className="flex items-center gap-3">
            <span className="serif-editorial text-6xl text-tertiary font-light">{poorCount}</span>
            {poorCount > 0 && <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>}
          </div>
        </div>
        <div className="bg-secondary-container p-8 rounded-xl flex flex-col justify-between h-48">
          <span className="label-md uppercase tracking-widest text-on-secondary-container text-xs font-bold font-label">Acceptable</span>
          <span className="serif-editorial text-6xl text-primary font-light">{accCount}</span>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-xl overflow-hidden p-8 shadow-sm">
         <SigmaChart data={results} />
      </section>

      <section className="mt-16">
        <ResultsTable results={results} />
      </section>
    </div>
  );
};

export default Dashboard;
