"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, X } from "lucide-react";
import { useTryOn } from "@/contexts/TryOnContext";

export default function TryOnToast() {
  const { freshCompletions, dismissCompletion } = useTryOn();
  const router = useRouter();

  // Auto-dismiss after 12s
  useEffect(() => {
    if (!freshCompletions.length) return;
    const timers = freshCompletions.map((job) =>
      setTimeout(() => dismissCompletion(job.jobId), 12000)
    );
    return () => timers.forEach(clearTimeout);
  }, [freshCompletions, dismissCompletion]);

  if (!freshCompletions.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
      {freshCompletions.map((job) => (
        <div
          key={job.jobId}
          className="bg-ink text-cream shadow-2xl flex items-center gap-3 pr-3 overflow-hidden animate-slide-in"
          style={{ animation: "slideIn 0.4s ease forwards" }}
        >
          {/* Garment thumbnail */}
          <div className="relative w-14 h-20 flex-shrink-0 bg-cream-dark overflow-hidden">
            <Image src={job.productImage} alt={job.productName} fill className="object-cover" unoptimized />
          </div>

          {/* Text */}
          <button
            className="flex-1 text-left py-3"
            onClick={() => {
              dismissCompletion(job.jobId);
              router.push("/provador");
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={11} className="text-gold" />
              <span className="text-xs text-gold uppercase tracking-widest">Prova pronta!</span>
            </div>
            <p className="text-sm font-display leading-tight">{job.productName}</p>
            <p className="text-xs text-cream/50 mt-0.5">Clique para ver o resultado →</p>
          </button>

          {/* Dismiss */}
          <button
            onClick={() => dismissCompletion(job.jobId)}
            className="text-cream/40 hover:text-cream transition-colors flex-shrink-0"
            aria-label="Fechar"
          >
            <X size={15} />
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
