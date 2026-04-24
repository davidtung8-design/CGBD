import React from 'react';

export const MasterLogo: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = "" }) => {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background Circle / Clock Outer */}
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2.5" opacity="0.1" />
        
        {/* Clock Marks */}
        <rect x="49" y="4" width="2" height="6" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="49" y="90" width="2" height="6" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="4" y="49" width="6" height="2" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="90" y="49" width="6" height="2" rx="1" fill="currentColor" opacity="0.4" />

        {/* The 'D' and 'T' integrated shape */}
        {/* 'D' part */}
        <path 
          d="M35 30V70C35 70 65 70 65 50C65 30 35 30 35 30Z" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* 'T' part - crossing over the D to form a centerpiece */}
        <path 
          d="M30 40H70" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round"
        />
        <path 
          d="M50 40V70" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round"
        />

        {/* Center timepiece dot */}
        <circle cx="50" cy="50" r="3" fill="#3B82F6" />
      </svg>
    </div>
  );
};
