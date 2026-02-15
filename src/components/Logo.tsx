import React from 'react';
import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  color?: 'default' | 'white';
}

export const Logo: React.FC<LogoProps> = ({ className, variant = 'full', color = 'default' }) => {
  const textColor = color === 'white' ? 'text-white' : 'text-gray-900 dark:text-white';
  const subTextColor = color === 'white' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400';

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="h-10 w-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
           {/* Handle & Frame */}
           <path 
             d="M10 15 H 25 C 28 15 30 17 32 20 L 40 60 H 85 C 88 60 90 58 91 55 L 95 25 H 35" 
             stroke="#DC2626" 
             strokeWidth="6" 
             strokeLinecap="round" 
             strokeLinejoin="round" 
           />
           
           {/* Grid / Speed Lines */}
           <path d="M50 25 L 55 60" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
           <path d="M65 25 L 68 60" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
           <path d="M80 25 L 80 60" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
           
           {/* Motion Lines (Speed effect) */}
           <path d="M38 35 H 90" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
           <path d="M42 48 H 88" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" opacity="0.2" />

           {/* Wheels */}
           <circle cx="45" cy="75" r="7" fill="#DC2626" />
           <circle cx="80" cy="75" r="7" fill="#DC2626" />
           
           {/* Wheel inner */}
           <circle cx="45" cy="75" r="2" fill="white" />
           <circle cx="80" cy="75" r="2" fill="white" />
        </svg>
      </div>
      
      {variant === 'full' && (
        <div className="flex flex-col justify-center h-full">
          <span className={cn("font-heading font-bold text-2xl tracking-tight leading-none mb-0.5", textColor)}>
            Impulse
          </span>
          <span className={cn("text-[0.65rem] font-bold tracking-[0.2em] uppercase leading-none", subTextColor)}>
            Online Store
          </span>
        </div>
      )}
    </div>
  );
};