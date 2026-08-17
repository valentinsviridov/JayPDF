import React from 'react';
import Image from 'next/image';

interface JayPdfLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'full' | 'icon';
  priority?: boolean;
}

export function JayPdfLogo({
  className = 'h-full w-auto object-contain',
  width,
  height,
  variant = 'full',
  priority = true,
}: JayPdfLogoProps) {
  if (variant === 'icon') {
    return (
      <Image
        src="/images/jaypdf-favicon.png"
        alt="JayPDF Icon"
        width={width ?? 64}
        height={height ?? 64}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src="/images/jaypdf-logo.png"
      alt="JayPDF"
      width={width ?? 400}
      height={height ?? 186}
      className={className}
      priority={priority}
      style={{ height: '100%', width: 'auto', maxHeight: '100%' }}
    />
  );
}

export default JayPdfLogo;
