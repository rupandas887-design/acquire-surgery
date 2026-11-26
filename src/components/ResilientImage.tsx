import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async' | 'auto';
  fetchPriority?: 'high' | 'low' | 'auto';
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`w-full h-full bg-gradient-to-br from-[#062B61] via-[#0E7490] to-[#059669] flex flex-col items-center justify-center p-4 text-center text-white ${className}`}
      >
        <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center mb-2">
          <Stethoscope className="w-5 h-5 text-[#6EE7B7]" />
        </div>
        <span className="text-xs font-semibold text-sky-100 max-w-[200px] leading-snug">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
