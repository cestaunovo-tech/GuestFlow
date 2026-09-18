import React from 'react';

interface GuestFlowLogoProps {
  variant?: 'stacked' | 'horizontal' | 'icon-only';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'white';
  className?: string;
  showTagline?: boolean;
}

export const GuestFlowLogo: React.FC<GuestFlowLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'light',
  className = '',
  showTagline = true,
}) => {
  // Unique gradient IDs to prevent collision across multiple instances
  const idSuffix = React.useId().replace(/:/g, '');
  const gradMainId = `gfGradMain_${idSuffix}`;
  const gradWaveId = `gfGradWave_${idSuffix}`;
  const gradSpurId = `gfGradSpur_${idSuffix}`;

  const iconSizes = {
    xs: 24,
    sm: 32,
    md: 42,
    lg: 60,
    xl: 84,
  };

  const currentIconSize = iconSizes[size];

  const wordmarkColor = theme === 'dark' || theme === 'white' ? '#FFFFFF' : '#142936';
  const flowColor = '#00ADB5';
  const taglineColor = theme === 'dark' || theme === 'white' ? '#94A3B8' : '#586E7A';

  const iconSVG = (
    <svg
      width={currentIconSize}
      height={currentIconSize}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      aria-label="GuestFlow Monogram"
    >
      <defs>
        <linearGradient id={gradMainId} x1="15%" y1="90%" x2="90%" y2="10%">
          <stop offset="0%" stopColor="#0B2B3C" />
          <stop offset="35%" stopColor="#026D82" />
          <stop offset="70%" stopColor="#00A89D" />
          <stop offset="100%" stopColor="#00C9B6" />
        </linearGradient>
        <linearGradient id={gradWaveId} x1="5%" y1="75%" x2="95%" y2="25%">
          <stop offset="0%" stopColor="#082A39" />
          <stop offset="45%" stopColor="#036980" />
          <stop offset="100%" stopColor="#00A7B5" />
        </linearGradient>
        <linearGradient id={gradSpurId} x1="10%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#00A2AA" />
          <stop offset="100%" stopColor="#00C6BE" />
        </linearGradient>
      </defs>

      <g transform="translate(120, 120)">
        {/* Outer G sweeping circular loop */}
        <path
          d="M -12,-96 C 54,-96 104,-48 104,18 C 104,40 95,60 82,76 C 73,66 64,58 52,54 C 40,50 18,50 -5,66 C -25,80 -50,94 -76,78 C -98,62 -114,24 -104,-24 C -94,-72 -58,-96 -12,-96 Z"
          fill={`url(#${gradMainId})`}
        />
        
        {/* Oceanic Wave Swell into center */}
        <path
          d="M -86,60 C -60,68 -30,54 -5,34 C 15,18 42,12 70,12 C 98,12 104,16 104,24 C 104,48 84,80 44,94 C 14,104 -34,100 -64,84 C -78,76 -84,68 -86,60 Z"
          fill={`url(#${gradWaveId})`}
        />

        {/* Dynamic horizontal flow arrow / crossbar spur */}
        <path
          d="M -6,14 C 14,-6 48,-4 88,8 C 100,12 104,18 104,34 C 94,44 68,46 40,44 C 12,42 -2,26 -6,14 Z"
          fill={`url(#${gradSpurId})`}
        />
      </g>
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{iconSVG}</div>;
  }

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center text-center ${className}`}>
        {iconSVG}
        <div className="mt-2">
          <div className="flex items-center justify-center font-extrabold tracking-tight" style={{ fontSize: currentIconSize * 0.72, lineHeight: 1 }}>
            <span style={{ color: wordmarkColor }}>Guest</span>
            <span style={{ color: flowColor }}>Flow</span>
          </div>
          {showTagline && (
            <p
              className="mt-1 font-semibold tracking-widest uppercase text-[10px] md:text-xs"
              style={{ color: taglineColor, letterSpacing: '0.18em' }}
            >
              Guest Experience &amp; Hotel Operations Platform
            </p>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {iconSVG}
      <div className="flex flex-col justify-center">
        <div className="flex items-center font-extrabold tracking-tight" style={{ fontSize: currentIconSize * 0.65, lineHeight: 1.1 }}>
          <span style={{ color: wordmarkColor }}>Guest</span>
          <span style={{ color: flowColor }}>Flow</span>
        </div>
        {showTagline && (
          <span
            className="font-semibold tracking-wider uppercase text-[9px] sm:text-[10px]"
            style={{ color: taglineColor, letterSpacing: '0.12em' }}
          >
            Guest Experience &amp; Hotel Operations Platform
          </span>
        )}
      </div>
    </div>
  );
};
