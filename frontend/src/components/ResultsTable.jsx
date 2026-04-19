import React from 'react';
import SigmaBadge from './SigmaBadge';
import { sigmaColor, fmt } from '../api/utils';
import clsx from 'clsx';

const ResultsTable = ({ results }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="bg-surface-container rounded-xl p-4 md:p-10 shadow-sm mt-6 md:mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-2">
        <h3 className="text-xl md:text-2xl font-headline text-primary italic">Detail Results Table</h3>
        <span className="text-xs md:text-sm font-label text-on-surface-variant">Live Data Source: HL7-SIGMA-V2</span>
      </div>
      
      <div className="overflow-x-auto bg-surface-container-lowest rounded-lg">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="px-6 py-5 text-xs font-label uppercase tracking-widest text-on-surface-variant/70">Analyte</th>
              <th className="px-6 py-5 text-xs font-label uppercase tracking-widest text-on-surface-variant/70">Value</th>
              <th className="px-6 py-5 text-xs font-label uppercase tracking-widest text-on-surface-variant/70">CV %</th>
              <th className="px-6 py-5 text-xs font-label uppercase tracking-widest text-on-surface-variant/70">Bias %</th>
              <th className="px-6 py-5 text-xs font-label uppercase tracking-widest text-on-surface-variant/70">TEa %</th>
              <th className="px-6 py-5 text-xs font-label uppercase tracking-widest text-on-surface-variant/70">Sigma</th>
              <th className="px-6 py-5 text-xs font-label uppercase tracking-widest text-on-surface-variant/70">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {results.map((row, idx) => {
              const biasExceedsTea = Math.abs(row.bias) > (row.tea || row.ref?.tea || 0);

              return (
                <tr key={row.parameter || idx} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-6">
                    <div className="font-headline italic text-primary text-lg">{row.parameter}</div>
                    <div className="text-xs text-on-surface-variant">Hematology</div>
                  </td>
                  <td className="px-6 py-6 font-body font-bold text-on-surface">{fmt(row.reportValue)}</td>
                  <td className="px-6 py-6 font-body text-on-surface-variant">{fmt(row.cv || row.ref?.cv)}</td>
                  <td className={clsx("px-6 py-6 font-body text-on-surface-variant", biasExceedsTea && "text-error font-bold")}>
                    {fmt(row.bias)}
                  </td>
                  <td className="px-6 py-6 font-body text-on-surface-variant">{fmt(row.tea || row.ref?.tea)}</td>
                  <td className="px-6 py-6 font-body font-bold text-primary text-lg">{fmt(row.sigma, 2)}</td>
                  <td className="px-6 py-6">
                    <SigmaBadge level={row.performanceLevel} performance={row.performance} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
