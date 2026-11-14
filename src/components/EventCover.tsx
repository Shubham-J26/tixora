"use client";

import { useState } from "react";
import CoverArt from "./CoverArt";

/**
 * Generated poster art with an optional organizer-supplied photo layered on top.
 * If the remote image fails, the generated art stays visible.
 */
export default function EventCover({
  src,
  seed,
  category,
  className = "",
  imgClassName = "",
}: {
  src?: string | null;
  seed: string;
  category: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        <CoverArt seed={seed} category={category} />
      </div>
      {src && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}
