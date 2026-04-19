import React from 'react';
import clsx from 'clsx';

const colors = {
  cyan: 'text-cyan bg-cyan/10',
  jade: 'text-jade bg-jade/10',
  coral: 'text-coral bg-coral/10',
  amber: 'text-amber bg-amber/10',
  violet: 'text-violet bg-violet/10',
  white: 'text-white bg-white/5'
};

const StatCard = ({ label, value, sub, accent = 'cyan', icon: Icon }) => {
  return (
    <div className="card p-6 flex flex-col justify-between h-40 hover:bg-panel transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs uppercase tracking-widest text-subtle font-mono font-semibold">{label}</span>
        {Icon && (
          <div className={clsx('w-10 h-10 rounded-full flex items-center justify-center shrink-0', colors[accent])}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div>
        <div className="text-5xl font-syne font-light text-white mb-1 flex items-baseline gap-2">
          {value}
          {sub && <span className="text-sm font-sans text-subtle font-normal">{sub}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
