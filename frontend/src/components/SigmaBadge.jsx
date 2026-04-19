import React from 'react';
import { sigmaColor } from '../api/utils';

const SigmaBadge = ({ level, performance }) => {
  const colors = sigmaColor(level);
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
      {performance?.toUpperCase() || level?.toUpperCase() || 'UNKNOWN'}
    </span>
  );
};

export default SigmaBadge;
