export const sigmaColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'world class':
    case 'world-class':
    case 'excellent':
      return { 
        text: 'text-on-secondary-container', 
        bg: 'bg-secondary-container', 
        border: 'border-transparent',
        dot: 'bg-primary',
        hex: '#cce5dc' 
      };
    case 'good':
      return { 
        text: 'text-on-primary-fixed-variant', 
        bg: 'bg-primary-fixed', 
        border: 'border-transparent',
        dot: 'bg-primary',
        hex: '#afefdd' 
      };
    case 'marginal':
      return { 
        text: 'text-on-tertiary-container', 
        bg: 'bg-tertiary-container', 
        border: 'border-transparent',
        dot: 'bg-tertiary-fixed',
        hex: '#693527' 
      };
    case 'poor':
      return { 
        text: 'text-on-error-container', 
        bg: 'bg-error-container', 
        border: 'border-transparent',
        dot: 'bg-error',
        hex: '#ffdad6' 
      };
    default:
      return { 
        text: 'text-on-surface-variant', 
        bg: 'bg-surface-variant', 
        border: 'border-transparent',
        dot: 'bg-outline',
        hex: '#e4e3d7' 
      };
  }
};

export const sigmaEmoji = (level) => {
  return ''; // We use styled dots now
};

export const fmt = (val, decimals = 1) => {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return Number(val).toFixed(decimals);
};
