"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Sparkles, Loader2, AlertCircle,
  Download, ShoppingBag, RotateCcw,
} from "lucide-react";
import { useTryOn } from "@/contexts/TryOnContext";
import ResultViewer from "@/components/ResultViewer";

export default function SessionResults() {
  const { jobs, clearJobs } = useTryOn();
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (i: number) => setActiveIndex(Math.max(0, Math.min(jobs.length - 1, i))),
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

        {/* Carousel + info */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

          {/* Carousel track */}
          <div className="w-full lg:flex-1 relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${idx * 100}%)` }}
              >
                {jobs.map((job) => (
                  <div key={job.jobId} className="w-full flex-shrink-0">
                    {job.status === "processing" && (
                      <div className="aspect-[3/4] bg-cream-dark flex flex-col items-center justify-center gap-4 rounded-sm">
                        <Loader2 size={36} className="text-gold animate-spin" />
                        <p className="text-muted text-sm">Gerando provador…</p>
                        <p className="text-xs text-muted/60">Você será avisado quando ficar pronto</p>
                      </div>
                    )}
                    {job.status === "failed" && (
                      <div className="aspect-[3/4] bg-cream-dark flex flex-col items-center justify-center gap-3 rounded-sm px-8 text-center">
                        <AlertCircle size={32} className="text-rose-dark" />
                        <p className="text-ink font-display">Não foi possível gerar</p>
                        <p className="text-muted text-sm">Tente experimentar novamente.</p>
                        <Link
                          href={`/colecao/${job.productSlug}`}
                          className="mt-2 text-xs uppercase tracking-widest text-ink border-b border-ink hover:text-gold hover:border-gold transition-colors"
                        >
                          Tentar novamente
                        </Link>
                      </div>
                    )}
                    {job.status === "completed" && job.outputUrl && (
                      <ResultViewer outputUrl={job.outputUrl} background={job.background} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Prev arrow */}
            {idx > 0 && (
              <button
                onClick={() => goTo(idx - 1)}
                aria-label="Peça anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-cream/90 border border-border hover:border-ink shadow-sm rounded-sm backdrop-blur-sm transition-all"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {/* Next arrow */}
            {idx < jobs.length - 1 && (
              <button
                onClick={() => goTo(idx + 1)}
                aria-label="Próxima peça"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-cream/90 border border-border hover:border-ink shadow-sm rounded-sm backdrop-blur-sm transition-all"
              >
                <ChevronRight size={18} />
              </button>
            )}

            {/* Dots indicator */}
            {jobs.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
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
          </div>

          {/* Info panel */}
          <div className="lg:w-56 flex flex-col gap-5 w-full">
            {jobs.length > 1 && (
              <p className="text-xs text-muted uppercase tracking-widest">
                {idx + 1} / {jobs.length}
              </p>
            )}

            <div>
              <p className="font-display text-xl text-ink leading-tight">{selected.productName}</p>
              <div className="mt-2">
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
              </div>
            </div>

            {/* Product thumbnail */}
            <div className="relative w-20 rounded-sm overflow-hidden border border-border" style={{ aspectRatio: "3/4" }}>
              <Image src={selected.productImage} alt={selected.productName} fill className="object-cover" unoptimized />
            </div>

            {/* Actions */}
            {selected.status === "completed" && selected.outputUrl && (
              <div className="flex flex-col gap-2">
                <a
                  href={selected.outputUrl}
                  download="sarambi-tryon.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-border text-muted py-2.5 text-xs uppercase tracking-widest hover:border-ink hover:text-ink transition-colors"
                >
                  <Download size={12} />
                  Baixar foto
                </a>
                <Link
                  href={`/colecao/${selected.productSlug}`}
                  className="flex items-center justify-center gap-2 bg-ink text-cream py-2.5 text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all"
                >
                  <ShoppingBag size={12} />
                  Ver produto
                </Link>
              </div>
            )}

            <Link
              href="/colecao"
              className="flex items-center justify-center gap-2 border border-dashed border-border text-muted py-3 text-xs uppercase tracking-widest hover:border-gold hover:text-gold transition-colors mt-auto"
            >
              <Sparkles size={12} />
              Experimentar mais peças
            </Link>
          </div>
        </div>

        {/* Thumbnail strip (só aparece com 2+ peças) */}
        {jobs.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {jobs.map((job, i) => (
              <button
                key={job.jobId}
                onClick={() => goTo(i)}
                title={job.productName}
                className={`flex-shrink-0 relative rounded-sm overflow-hidden border-2 transition-all`}
                style={{
                  width: 56,
                  height: 75,
                  borderColor: i === idx ? "var(--color-ink, #1A1713)" : "transparent",
                  opacity: i === idx ? 1 : 0.5,
                }}
              >
                <Image src={job.productImage} alt={job.productName} fill className="object-cover" unoptimized />
                {job.status === "processing" && (
                  <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
                    <Loader2 size={11} className="text-gold animate-spin" />
                  </div>
                )}
                {job.status === "failed" && (
                  <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
                    <AlertCircle size={11} className="text-rose" />
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
