"use client";

import { useEffect, useState } from "react";

export type ImageDimensions = {
  width: number;
  height: number;
};

export function useImageDimensions(imageUrl: string | undefined) {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setDimensions(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const img = new window.Image();
    img.onload = () => {
      if (cancelled) return;
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setLoading(false);
    };
    img.onerror = () => {
      if (cancelled) return;
      setDimensions(null);
      setLoading(false);
    };
    img.src = imageUrl;

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return { dimensions, loading };
}

export function formatDimensions(dimensions: ImageDimensions | null) {
  if (!dimensions) return null;
  return `${dimensions.width} × ${dimensions.height} px`;
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function getAspectRatioLabel(dimensions: ImageDimensions) {
  const divisor = gcd(dimensions.width, dimensions.height);
  if (!divisor) return null;
  return `${dimensions.width / divisor}:${dimensions.height / divisor}`;
}
