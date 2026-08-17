import React from 'react';

interface JayPdfLogoProps {
  className?: string;
  size?: number;
}

export function JayPdfLogo({ className = 'w-8 h-8', size }: JayPdfLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-label="JayPDF Logo"
    >
      <defs>
        <linearGradient id="jayGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="jayGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="jayGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Left Ear Background with Lynx Tuft */}
      <path d="M 32 50 L 16 12 L 48 34 Z" fill="url(#jayGradPrimary)" stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 16 12 L 11 2 L 20 10" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 14 6 L 17 11" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      <polygon points="30,46 22,22 42,36" fill="url(#jayGradCyan)" />

      {/* Right Ear Background with Lynx Tuft */}
      <path d="M 88 50 L 104 12 L 72 34 Z" fill="url(#jayGradPrimary)" stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 104 12 L 109 2 L 100 10" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 106 6 L 103 11" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      <polygon points="90,46 98,22 78,36" fill="url(#jayGradCyan)" />

      {/* Maine Coon Crown & Forehead */}
      <polygon points="48,34 60,26 72,34 60,48" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="32,50 48,34 60,48 44,60" fill="url(#jayGradPrimary)" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="88,50 72,34 60,48 76,60" fill="url(#jayGradPrimary)" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />

      {/* Maine Coon Cheek Tufts / Ruff */}
      <polygon points="32,50 12,66 28,74 44,60" fill="url(#jayGradPrimary)" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="28,74 8,86 32,90 48,82" fill="#ffffff" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="88,50 108,66 92,74 76,60" fill="url(#jayGradPrimary)" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="92,74 112,86 88,90 72,82" fill="#ffffff" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />

      {/* Blue Jay Dark Mask */}
      <polygon points="44,60 60,48 54,64" fill="url(#jayGradDark)" />
      <polygon points="76,60 60,48 66,64" fill="url(#jayGradDark)" />

      {/* Schematic Cat Eyes */}
      <polygon points="36,62 48,58 46,68 34,68" fill="url(#jayGradCyan)" stroke="#0f172a" strokeWidth="1.5" />
      <polygon points="84,62 72,58 74,68 86,68" fill="url(#jayGradCyan)" stroke="#0f172a" strokeWidth="1.5" />
      <line x1="41" y1="59" x2="41" y2="67" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="79" y1="59" x2="79" y2="67" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="39" cy="62" r="1" fill="#ffffff" />
      <circle cx="77" cy="62" r="1" fill="#ffffff" />

      {/* Bridge of Nose & Muzzle */}
      <polygon points="54,64 66,64 60,78" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
      <polygon points="56,76 64,76 60,82" fill="#0f172a" />
      <polygon points="60,82 46,82 48,94 60,90" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="60,82 74,82 72,94 60,90" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="60,90 54,98 66,98" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" />

      {/* Chest Ruff */}
      <polygon points="48,94 60,116 72,94 60,98" fill="url(#jayGradPrimary)" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="32,90 48,94 60,116 38,110" fill="#ffffff" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="88,90 72,94 60,116 82,110" fill="#ffffff" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />

      {/* Whiskers */}
      <line x1="38" y1="84" x2="16" y2="80" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="36" y1="88" x2="18" y2="92" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="82" y1="84" x2="104" y2="80" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="84" y1="88" x2="102" y2="92" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}
export default JayPdfLogo;
