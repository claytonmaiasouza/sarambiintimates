"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles, Loader2, AlertCircle, Download, ShoppingBag, RotateCcw,
} from "lucide-react";
import { useTryOn, type TryOnJob } from "@/contexts/TryOnContext";
import ResultViewer from "@/components/ResultViewer";

// ── Side card (prev / next peek) ─────────────────────────────────────────────

function SideCard({ job, onClick }: { job: TryOnJob; onClick: () => void }) {
  const thumb =
    job.status === "completed" && job.outputUrl ? job.outputUrl : job.productImage;

  return (
    <button
      onClick={onClick}
      className="w-full group relative rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      style={{ aspectRatio: "3/4" }}
      aria-label={job.productName}
    >
      <Image src={thumb} alt={job.productName} fill className="object-cover" unoptimized />

      {/* dim overlay + label */}
      <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/10 transition-colors" />

      {job.status === "processing" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={20} className="text-gold animate-spin" />
        </div>
      )}
      {job.status === "failed" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertCircle size={18} className="text-rose" />
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/70 to-transparent px-2 py-2">
        <p className="text-cream text-xs font-display truncate">{job.productName}</p>
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SessionResults() {
  const { jobs, clearJobs } = useTryOn();
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const goTo = useCallback(
    (i: number) => {
      setActiveIndex(Math.max(0, Math.min(jobs.length - 1, i)));
      setAnimKey((k) => k + 1);
    },
    [jobs.length]
  );

  if (!jobs.length) {
    return (
      <section className="py-24 px-6 bg-cream flex-1">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center">
            <Sparkles size={28} className="text-gold/40" />
          </div>
          <h2 className="font-display text-3xl text-ink">Nenhuma prova ainda</h2>
          <p className="text-muted text-base max-w-sm">
            Acesse qualquer produto da coleção e clique em{" "}
            <strong className="text-ink">Experimentar virtualmente</strong> para começar.
          </p>
          <Link
            href="/colecao"
            className="flex items-center gap-2 bg-ink text-cream px-8 py-4 text-sm uppercase tracking-widest hover:bg-gold hover:text-ink transition-all"
          >
            <ShoppingBag size={15} />
            Ver coleção
          </Link>
        </div>
      </section>
    );
  }

  const idx = Math.min(activeIndex, jobs.length - 1);
  const selected = jobs[idx];
  const prevJob = idx > 0 ? jobs[idx - 1] : null;
  const nextJob = idx < jobs.length - 1 ? jobs[idx + 1] : null;

  return (
    <section className="py-12 px-6 bg-cream flex-1">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl text-ink">Suas provas</h2>
            <p className="text-muted text-sm mt-1">
              {jobs.length} peça{jobs.length > 1 ? "s" : ""} experimentada{jobs.length > 1 ? "s" : ""} nesta sessão
            </p>
          </div>
          <button
            onClick={clearJobs}
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted hover:text-rose-dark transition-colors"
          >
            <RotateCcw size={13} />
            Limpar tudo
          </button>
        </div>

        {/* ── Peek carousel ──────────────────────────────────────────────────── */}
        <div className="flex items-end gap-3 sm:gap-5">

          {/* Prev peek */}
          <div className={`flex-1 flex justify-end transition-opacity duration-300 ${prevJob ? "opacity-60 hover:opacity-85" : "invisible"}`}>
            <div className="w-[75%] sm:w-[70%]">
              {prevJob && <SideCard job={prevJob} onClick={() => goTo(idx - 1)} />}
            </div>
          </div>

          {/* Center — active card */}
          <div className="flex-[1.8] relative z-10" style={{ filter: "drop-shadow(0 20px 40px rgba(26,23,19,0.18))" }}>
            <div key={`center-${animKey}`} className="carousel-in">
              {selected.status === "processing" && (
                <div className="aspect-[3/4] bg-cream-dark flex flex-col items-center justify-center gap-4 rounded-sm">
                  <Loader2 size={36} className="text-gold animate-spin" />
                  <p className="text-muted text-sm">Gerando provador…</p>
                  <p className="text-xs text-muted/60">Você será avisado quando ficar pronto</p>
                </div>
              )}
              {selected.status === "failed" && (
                <div className="aspect-[3/4] bg-cream-dark flex flex-col items-center justify-center gap-3 rounded-sm px-8 text-center">
                  <AlertCircle size={32} className="text-rose-dark" />
                  <p className="text-ink font-display">Não foi possível gerar</p>
                  <p className="text-muted text-sm">Tente experimentar novamente.</p>
                  <Link
                    href={`/colecao/${selected.productSlug}`}
                    className="mt-2 text-xs uppercase tracking-widest text-ink border-b border-ink hover:text-gold hover:border-gold transition-colors"
                  >
                    Tentar novamente
                  </Link>
                </div>
              )}
              {selected.status === "completed" && selected.outputUrl && (
                <ResultViewer outputUrl={selected.outputUrl} background={selected.background} />
              )}
            </div>
          </div>

          {/* Next peek */}
          <div className={`flex-1 transition-opacity duration-300 ${nextJob ? "opacity-60 hover:opacity-85" : "invisible"}`}>
            <div className="w-[75%] sm:w-[70%]">
              {nextJob && <SideCard job={nextJob} onClick={() => goTo(idx + 1)} />}
            </div>
          </div>
        </div>

        {/* Dots */}
        {jobs.length > 1 && (
          <div className="flex justify-center items-center gap-2">
            {jobs.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir para peça ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === idx ? "w-5 h-1.5 bg-ink" : "w-1.5 h-1.5 bg-border hover:bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        {/* Info + actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-border pt-6">
          <div className="flex items-center gap-4">
            {/* Product thumb */}
            <div className="relative w-12 rounded-sm overflow-hidden flex-shrink-0 border border-border" style={{ aspectRatio: "3/4" }}>
              <Image src={selected.productImage} alt={selected.productName} fill className="object-cover" unoptimized />
            </div>
            <div>
              <p className="font-display text-lg text-ink leading-tight">{selected.productName}</p>
              <div className="mt-1">
                {selected.status === "processing" && (
                  <span className="flex items-center gap-1.5 text-xs text-gold">
                    <Loader2 size={11} className="animate-spin" />
                    Processando…
                  </span>
                )}
                {selected.status === "completed" && (
                  <span className="text-xs text-green-700">✓ Pronto</span>
                )}
                {selected.status === "failed" && (
                  <span className="text-xs text-rose-dark">Não foi possível gerar</span>
                )}
                {jobs.length > 1 && (
                  <span className="text-xs text-muted/60 ml-2">{idx + 1} / {jobs.length}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {selected.status === "completed" && selected.outputUrl && (
              <>
                <a
                  href={selected.outputUrl}
                  download="sarambi-tryon.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-border text-muted px-4 py-2 text-xs uppercase tracking-widest hover:border-ink hover:text-ink transition-colors"
                >
                  <Download size={12} />
                  Baixar
                </a>
                <Link
                  href={`/colecao/${selected.productSlug}`}
                  className="flex items-center gap-2 bg-ink text-cream px-4 py-2 text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all"
                >
                  <ShoppingBag size={12} />
                  Ver produto
                </Link>
              </>
            )}
            <Link
              href="/colecao"
              className="flex items-center gap-2 border border-dashed border-border text-muted px-4 py-2 text-xs uppercase tracking-widest hover:border-gold hover:text-gold transition-colors"
            >
              <Sparkles size={12} />
              Experimentar mais
            </Link>
          </div>
        </div>

        {/* Thumbnail strip */}
        {jobs.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {jobs.map((job, i) => (
              <button
                key={job.jobId}
                onClick={() => goTo(i)}
                title={job.productName}
                className="flex-shrink-0 relative rounded-sm overflow-hidden border-2 transition-all"
                style={{
                  width: 52,
                  height: 69,
                  borderColor: i === idx ? "var(--color-ink, #1A1713)" : "transparent",
                  opacity: i === idx ? 1 : 0.45,
                }}
              >
                <Image src={job.productImage} alt={job.productName} fill className="object-cover" unoptimized />
                {job.status === "processing" && (
                  <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
                    <Loader2 size={10} className="text-gold animate-spin" />
                  </div>
                )}
                {job.status === "failed" && (
                  <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
                    <AlertCircle size={10} className="text-rose" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
