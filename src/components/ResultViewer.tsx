"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

export default function ResultViewer({ outputUrl }: { outputUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [imgStyle, setImgStyle] = useState<React.CSSProperties>({});
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const scale = 2.2;
    const tx = (0.5 - x) * (scale - 1) * 50;
    const ty = (0.5 - y) * (scale - 1) * 50;
    setImgStyle({ transform: `scale(${scale}) translate(${tx}%, ${ty}%)` });
    const rx = (0.5 - x) * 24;
    const ry = (y - 0.5) * 14;
    setTiltStyle({ transform: `perspective(600px) rotateY(${rx}deg) rotateX(${ry}deg)` });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setImgStyle({});
    setTiltStyle({ transform: "perspective(600px) rotateY(0deg) rotateX(0deg)" });
    setTimeout(() => setTiltStyle({}), 400);
  }, []);

  return (
    <div
      ref={containerRef}
      className="aspect-[3/4] relative rounded-sm select-none"
      style={{ ...tiltStyle, transition: hovered ? "none" : "transform 0.4s ease" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 overflow-hidden rounded-sm">
        <Image
          src={outputUrl}
          alt="Resultado do provador"
          fill
          className="object-cover"
          style={{ ...imgStyle, transition: hovered ? "none" : "transform 0.3s ease", cursor: hovered ? "zoom-in" : "default" }}
          unoptimized
        />
      </div>

      {!hovered && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/60 to-transparent p-3 flex items-center justify-center rounded-b-sm">
          <span className="text-cream/80 text-xs tracking-wide">Passe o mouse para zoom · mova para girar</span>
        </div>
      )}
    </div>
  );
}
