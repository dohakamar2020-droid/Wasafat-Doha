"use client";
import { useEffect, useState } from "react";
import { localPhoto } from "@/lib/photos";
export default function AttemptPhoto({ path }: { path: string }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let url = "";
    let closed = false;
    if (path.startsWith("local:"))
      localPhoto(path)
        .then((b) => {
          if (b && !closed) {
            url = URL.createObjectURL(b);
            setSrc(url);
          }
        })
        .catch(() => {});
    else setSrc(`/api/attempt-photo?path=${encodeURIComponent(path)}`);
    return () => {
      closed = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [path]);
  return src ? (
    <img
      className="photo-result"
      src={src}
      alt="صورة نتيجتي للوصفة"
      loading="lazy"
    />
  ) : (
    <p>الصورة محفوظة على الجهاز اللي اتعملت عليه التجربة.</p>
  );
}
