"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Loader2, AlertCircle, Download, RotateCcw, ShoppingBag } from "lucide-react";
import { useTryOn } from "@/contexts/TryOnContext";
import ResultViewer from "@/components/ResultViewer";

export default function SessionResults() {
  const { jobs, clearJobs } = useTryOn();
  const [activeJob, setActiveJob] = useState<string | null>(null);

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

  const selected = jobs.find((j) => j.jobId === activeJob) ?? jobs[0];

  return (
    <section className="py-12 px-6 bg-cream flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl text-ink">Suas provas</h2>
            <p className="text-muted text-sm mt-1">{jobs.length} peça{jobs.length > 1 ? "s" : ""} experimentada{jobs.length > 1 ? "s" : ""} nesta sessão</p>
          </div>
          <button
            onClick={clearJobs}
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted hover:text-rose-dark transition-colors"
          >
            <RotateCcw size={13} />
            Limpar tudo
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Result viewer — left 2 cols */}
          <div className="lg:col-span-2">
            {selected.status === "processing" && (
              <div className="aspect-[3/4] bg-cream-dark flex flex-col items-center justify-center gap-4 rounded-sm">
                <Loader2 size={36} className="text-gold animate-spin" />
                <p className="text-muted text-sm">Gerando provador — aguarde…</p>
                <p className="text-xs text-muted/60">Você será avisado quando ficar pronto</p>
              </div>
            )}
            {selected.status === "failed" && (
              <div className="aspect-[3/4] bg-cream-dark flex flex-col items-center justify-center gap-3 rounded-sm px-8 text-center">
                <AlertCircle size={32} className="text-rose-dark" />
                <p className="text-ink font-display">Não foi possível gerar</p>
                <p className="text-muted text-sm">Tente experimentar novamente na página do produto.</p>
                <Link
                  href={`/colecao/${selected.productSlug}`}
                  className="mt-2 text-xs uppercase tracking-widest text-ink border-b border-ink hover:text-gold hover:border-gold transition-colors"
                >
                  Tentar novamente
                </Link>
              </div>
            )}
            {selected.status === "completed" && selected.outputUrl && (
              <div className="flex flex-col gap-4">
                <ResultViewer outputUrl={selected.outputUrl} />
                <div className="flex gap-3">
                  <a
                    href={selected.outputUrl}
                    download="sarambi-tryon.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-border text-muted px-5 py-2.5 text-xs uppercase tracking-widest hover:border-ink hover:text-ink transition-colors"
                  >
                    <Download size={13} />
                    Baixar
                  </a>
                  <Link
                    href={`/colecao/${selected.productSlug}`}
                    className="flex items-center gap-2 bg-ink text-cream px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all"
                  >
                    <ShoppingBag size={13} />
                    Ver produto
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Job list — right col */}
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-muted mb-1">Peças experimentadas</p>
            {jobs.map((job) => (
              <button
                key={job.jobId}
                onClick={() => setActiveJob(job.jobId)}
                className={`flex items-center gap-3 p-3 border text-left transition-all ${
                  (activeJob ?? jobs[0].jobId) === job.jobId
                    ? "border-ink bg-ink/5"
                    : "border-border hover:border-gold"
                }`}
              >
                {/* Product thumb */}
                <div className="relative w-14 h-20 bg-cream-dark flex-shrink-0 overflow-hidden rounded-sm">
                  <Image src={job.productImage} alt={job.productName} fill className="object-cover" unoptimized />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm text-ink truncate">{job.productName}</p>
                  <div className="mt-1">
                    {job.status === "processing" && (
                      <span className="inline-flex items-center gap-1 text-xs text-gold">
                        <Loader2 size={10} className="animate-spin" />
                        Processando…
                      </span>
                    )}
                    {job.status === "completed" && (
                      <span className="text-xs text-green-700">✓ Pronto</span>
                    )}
                    {job.status === "failed" && (
                      <span className="text-xs text-rose-dark">Falhou</span>
                    )}
                  </div>
                </div>

                {/* Body photo mini thumb */}
                <div className="relative w-10 h-14 bg-cream-dark flex-shrink-0 overflow-hidden rounded-sm opacity-60">
                  <Image src={job.bodyPreview} alt="sua foto" fill className="object-cover" unoptimized />
                </div>
              </button>
            ))}

            <Link
              href="/colecao"
              className="mt-2 flex items-center justify-center gap-2 border border-dashed border-border text-muted py-3 text-xs uppercase tracking-widest hover:border-gold hover:text-gold transition-colors"
            >
              <Sparkles size={12} />
              Experimentar mais peças
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
