'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ImageWithFallback({ src, alt, className, ...props }: any) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-400 text-4xl`}>
        👤
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}