import React from 'react';

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 animate-fade-up">
      <div>
        <h1 className="text-4xl md:text-5xl font-syne font-bold text-white mb-2">{title}</h1>
        {subtitle && <p className="text-subtle text-lg font-sans max-w-2xl">{subtitle}</p>}
      </div>
      {children && (
        <div className="mt-4 sm:mt-0 flex gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
