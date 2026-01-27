
"use client";

import Image from "next/image";
import { useState } from "react";

export default function Reusable({
  src,
  alt,
  glow,
  onClick,
}: {
  src: string;
  alt: string;
  glow: string;
  onClick?: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    onClick?.();
    setTimeout(() => setPressed(false), 200);
  };

  return (
    <button onClick={handleClick} className="group">
      <Image
        src={src}
        alt={alt}
        width={24}
        height={24}
        className={`
          cursor-pointer
          transition-all duration-200 ease-out
          /* Hover */
          group-hover:scale-110
          group-hover:${glow}

          /* Click */
          ${pressed ? "scale-125" : ""}
        `}
      />
    </button>
  );
}
