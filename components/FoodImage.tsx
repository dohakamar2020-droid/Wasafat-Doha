"use client";
import { useState, useRef, useEffect, type ImgHTMLAttributes } from "react";
export default function FoodImage({
  src,
  alt,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    setFailed(!!ref.current?.complete && ref.current.naturalWidth === 0);
  }, [src]);
  // Use the official thumbnail; a local illustration prevents broken image boxes offline or when YouTube is blocked.
  return (
    <img
      ref={ref}
      {...props}
      src={failed ? "/recipe-fallback.svg" : src}
      alt={alt || ""}
      onError={() => setFailed(true)}
    />
  );
}
