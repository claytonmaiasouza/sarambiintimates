"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackClassName?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackClassName,
  className,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-cream-dark flex items-center justify-center ${fallbackClassName ?? className ?? ""}`}
        aria-label={alt}
      >
        <span className="text-muted/30 text-xs uppercase tracking-widest text-center px-4">
          {alt}
        </span>
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
