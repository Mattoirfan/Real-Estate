import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'compact' | 'icon-only';
  theme?: 'dark' | 'light';
  className?: string;
  subline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  theme = 'dark',
  className = '',
  subline = false
}) => {
  const isLight = theme === 'light';
  const textColor = isLight ? '#FFFFFF' : '#0B132B';
  const mutedTextColor = isLight ? '#94A3B8' : '#64748B';
  const goldColor = '#C6A76A';
  const accentColor = isLight ? '#FFFFFF' : '#0B132B';

  // Architectural Emblem: Precision geometric gable, keystone circle & foundation lines
  const Emblem = (
    <svg 
      viewBox="0 0 100 100" 
      className={variant === 'icon-only' ? 'w-full h-full' : 'w-8 h-8 shrink-0'}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="100" height="100" rx="16" fill={isLight ? '#151E3F' : '#0B132B'} />
      {/* Outer Gable */}
      <path 
        d="M50 18L84 45V82H62V58H38V82H16V45L50 18Z" 
        stroke={goldColor} 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Inner Keystone Diamond/Circle */}
      <circle cx="50" cy="40" r="6" fill={goldColor} />
      {/* Horizon Baseline */}
      <line x1="28" y1="70" x2="72" y2="70" stroke={goldColor} strokeWidth="3" strokeOpacity="0.4" />
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{Emblem}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {Emblem}
      <div className="flex flex-col">
        <div className="flex items-center tracking-[0.16em] text-lg font-bold font-['Manrope']" style={{ color: textColor }}>
          <span>ESTATE</span>
          <span style={{ color: goldColor }}>NOVA</span>
        </div>
        {subline && (
          <span className="text-[9px] uppercase tracking-[0.24em] font-semibold" style={{ color: mutedTextColor }}>
            Private Residences
          </span>
        )}
      </div>
    </div>
  );
};
