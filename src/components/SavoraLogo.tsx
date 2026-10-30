import React from 'react';

interface SavoraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const SavoraLogo: React.FC<SavoraLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Savora Icon: Culinary Pan & Herb Leaf */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Pan Body in Tomato Red (#E4572E) */}
          <circle
            cx="22"
            cy="26"
            r="16"
            stroke="#E4572E"
            strokeWidth="3.5"
            fill="#FFF1EE"
            className="dark:fill-stone-900"
          />
          <circle
            cx="22"
            cy="26"
            r="11"
            stroke="#E4572E"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            strokeOpacity="0.4"
          />

          {/* Pan Handle in Charcoal */}
          <path
            d="M33 37L43 45"
            stroke="#2B2B2B"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="dark:stroke-stone-300"
          />

          {/* Fork Silhouette inside pan */}
          <path
            d="M18 20V24M22 19V24M26 20V24M22 24V30"
            stroke="#E4572E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Herb Leaf sprouting upwards in Herb Green (#4C9F70) */}
          <path
            d="M22 16C22 16 23 8 32 6C32 6 34 15 26 17C24.5 17.4 23 16.9 22 16Z"
            fill="#4C9F70"
          />
          {/* Leaf central vein */}
          <path
            d="M23 15C25.5 13 28 10 31 7.5"
            stroke="#E4F7EC"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Golden yolk sparkle dot (#F6B93B) */}
          <circle cx="15" cy="23" r="2" fill="#F6B93B" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif tracking-tight font-bold text-[#2B2B2B] dark:text-stone-50 leading-none ${textSizes[size]}`}
          >
            Savora
          </span>
          <span className="text-[10px] tracking-wider uppercase font-medium text-[#E4572E] font-sans mt-0.5">
            Kitchen
          </span>
        </div>
      )}
    </div>
  );
};
