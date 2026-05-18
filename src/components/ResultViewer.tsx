"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { BG_CONFIGS } from "@/lib/backgroundRemoval";

const ZOOM_SCALE = 2.5;

export default function ResultViewer({
  outputUrl,
  background = "studio",
}: {
  outputUrl: string;
  background?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Desktop: hover + tilt
  const [hovered, setHovered] = useState(false);
  const [imgStyle, setImgStyle] = useState<React.CSSProperties>({});
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  // Mobile: tap-to-zoom + drag-to-pan
  const [mobileZoomed, setMobileZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const touchRef = useRef<{ startX: number; startY: number; time: number; lastOriginX: number; lastOriginY: number } | null>(null);

  const bgGradient =
    (BG_CONFIGS as Record<string, { gradient: string }>)[background]?.gradient ??
    BG_CONFIGS.studio.gradient;

  // --- Desktop handlers ---
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tx = (0.5 - x) * (ZOOM_SCALE - 1) * 50;
    const ty = (0.5 - y) * (ZOOM_SCALE - 1) * 50;
    setImgStyle({ transform: `scale(${ZOOM_SCALE}) translate(${tx}%, ${ty}%)` });
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

  // --- Mobile handlers ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      time: Date.now(),
      lastOriginX: origin.x,
      lastOriginY: origin.y,
    };
  }, [origin]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!mobileZoomed || !touchRef.current) return;
    e.preventDefault();
    const t = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = t.clientX - touchRef.current.startX;
    const dy = t.clientY - touchRef.current.startY;
    const sensitivity = 100 / (ZOOM_SCALE - 1);
    const newX = Math.max(0, Math.min(100, touchRef.current.lastOriginX - (dx / rect.width) * sensitivity));
    const newY = Math.max(0, Math.min(100, touchRef.current.lastOriginY - (dy / rect.height) * sensitivity));
    setOrigin({ x: newX, y: newY });
  }, [mobileZoomed]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const t = e.changedTouches[0];
    const dx = Math.abs(t.clientX - touchRef.current.startX);
    const dy = Math.abs(t.clientY - touchRef.current.startY);
    const dt = Date.now() - touchRef.current.time;
    const isTap = dx < 12 && dy < 12 && dt < 250;

    if (isTap) {
      if (!mobileZoomed) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const ox = ((t.clientX - rect.left) / rect.width) * 100;
          const oy = ((t.clientY - rect.top) / rect.height) * 100;
          setOrigin({ x: ox, y: oy });
        }
        setMobileZoomed(true);
      } else {
        setMobileZoomed(false);
        setOrigin({ x: 50, y: 50 });
      }
    }
    touchRef.current = null;
  }, [mobileZoomed]);

  const mobileImgStyle: React.CSSProperties = mobileZoomed
    ? { transform: `scale(${ZOOM_SCALE})`, transformOrigin: `${origin.x}% ${origin.y}%`, transition: "none", cursor: "grab" }
    : { transform: "scale(1)", transformOrigin: "center", transition: "transform 0.3s ease", cursor: "zoom-in" };

  const combinedImgStyle: React.CSSProperties = hovered
    ? { ...imgStyle, transition: "none", cursor: "zoom-in" }
    : { ...mobileImgStyle };

  return (
    <div
      ref={containerRef}
      className="aspect-[3/4] relative rounded-sm select-none touch-none overflow-hidden"
      style={{
        background: bgGradient,
        ...tiltStyle,
        transition: hovered ? "none" : "transform 0.4s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Image
        src={outputUrl}
        alt="Resultado do provador"
        fill
        className="object-cover"
        style={combinedImgStyle}
        unoptimized
      />

      {/* Hint overlay */}
      {!hovered && !mobileZoomed && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/30 to-transparent p-3 flex items-center justify-center pointer-events-none">
          <span className="text-white/80 text-xs tracking-wide">
            <span className="hidden md:inline">Passe o mouse para zoom · mova para girar</span>
            <span className="md:hidden">Toque para ampliar · arraste para mover</span>
          </span>
        </div>
      )}

      {mobileZoomed && (
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full pointer-events-none md:hidden">
          Toque para sair do zoom
        </div>
      )}
    </div>
  );
}
