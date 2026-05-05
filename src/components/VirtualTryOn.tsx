"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Upload, Loader2, RotateCcw, Download, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import { products } from "@/lib/products";
import SafeImage from "@/components/SafeImage";
import ResultViewer from "@/components/ResultViewer";

type TryOnStatus = "idle" | "uploading" | "processing" | "done" | "error";

function TryOnResultPanel({
  status,
  resultImage,
  errorMsg,
}: {
  status: TryOnStatus;
  resultImage: string | null;
  errorMsg: string | null;
}) {
  if (status === "processing" || status === "uploading") {
    return (
      <div className="aspect-[3/4] bg-cream-dark relative rounded-sm overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-gold animate-spin" />
          <p className="text-sm text-muted">
            {status === "uploading" ? "Enviando imagem..." : "Gerando provador virtual..."}
          </p>
          <p className="text-xs text-muted/60 text-center max-w-[180px]">Isso pode levar até 30 segundos</p>
        </div>
      </div>
    );
  }
  if (resultImage) {
    return (
      <div className="flex flex-col gap-2">
        <ResultViewer outputUrl={resultImage} />
        <a
          href={resultImage}
          download="sarambi-tryon.jpg"
          target="_blank"
          rel="noopener noreferrer"
          className="self-end flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors"
        >
          <Download size={13} /> Baixar
        </a>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="aspect-[3/4] bg-cream-dark relative rounded-sm overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 px-4 text-center">
          <AlertCircle size={28} className="text-rose-dark" />
          <p className="text-sm text-ink">Algo deu errado</p>
          <p className="text-xs text-muted">{errorMsg}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="aspect-[3/4] bg-cream-dark relative rounded-sm overflow-hidden flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-center px-4">
        <Sparkles size={28} className="text-gold/40" />
        <p className="text-sm text-muted">
          Envie sua foto e clique em <strong className="text-ink">Experimentar</strong>
        </p>
      </div>
    </div>
  );
}

const SAMPLE_MODELS = [
  { id: "s1", src: "/images/samples/model-1.jpg", label: "Modelo 1" },
  { id: "s2", src: "/images/samples/model-2.jpg", label: "Modelo 2" },
];

export default function VirtualTryOn({ defaultProductSlug }: { defaultProductSlug?: string }) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [selectedProduct, setSelectedProduct] = useState(
    products.find((p) => p.slug === defaultProductSlug) ?? products[0]
  );
  const [status, setStatus] = useState<TryOnStatus>("idle");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setUserFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setUserImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setResultImage(null);
    setStatus("idle");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleTryOn = async () => {
    if (!userFile && !userImage) return;
    setStatus("uploading");
    setErrorMsg(null);
    setResultImage(null);

    try {
      const formData = new FormData();
      if (userFile) {
        formData.append("model_image", userFile);
      } else if (userImage) {
        // sample model — fetch and convert to File
        const res = await fetch(userImage);
        const blob = await res.blob();
        formData.append("model_image", new File([blob], "model.jpg", { type: blob.type || "image/jpeg" }));
      }
      formData.append("garment_slug", selectedProduct.slug);
      formData.append("category", selectedProduct.tryonCategory);

      setStatus("processing");

      const res = await fetch("/api/tryon", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Erro inesperado" }));
        throw new Error(err.error || "Falha ao processar");
      }

      const data = await res.json();
      setResultImage(data.output);
      setStatus("done");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Ocorreu um erro. Tente novamente.");
    }
  };

  const handleReset = () => {
    setUserImage(null);
    setUserFile(null);
    setResultImage(null);
    setStatus("idle");
    setErrorMsg(null);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1: Upload photo */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-ink text-cream text-xs flex items-center justify-center font-display">1</span>
            <h3 className="font-display text-lg">Sua foto</h3>
          </div>
          <p className="text-muted text-sm">
            Envie uma foto sua de corpo inteiro, de frente, com fundo claro.
          </p>

          {userImage ? (
            <div className="relative aspect-[3/4] bg-cream-dark overflow-hidden rounded-sm">
              <Image src={userImage} alt="Sua foto" fill className="object-cover" unoptimized />
              <button
                onClick={() => { setUserImage(null); setUserFile(null); setResultImage(null); setStatus("idle"); }}
                className="absolute top-2 right-2 bg-ink/80 text-cream p-1.5 rounded-full hover:bg-ink"
                title="Remover"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`aspect-[3/4] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors rounded-sm ${
                isDragActive ? "border-rose bg-rose/5" : "border-border hover:border-gold hover:bg-gold/5"
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={28} className="text-muted mb-3" />
              <p className="text-sm text-ink font-medium">
                {isDragActive ? "Solte aqui" : "Arraste ou clique"}
              </p>
              <p className="text-xs text-muted mt-1">JPG, PNG até 10MB</p>
            </div>
          )}

          <p className="text-xs text-muted text-center">— ou use uma modelo de exemplo —</p>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => { setUserImage(m.src); setUserFile(null); setResultImage(null); setStatus("idle"); }}
                className={`relative aspect-[3/4] overflow-hidden rounded-sm border-2 transition-colors ${
                  userImage === m.src ? "border-rose" : "border-transparent hover:border-gold"
                }`}
              >
                <SafeImage
                  src={m.src}
                  alt={m.label}
                  fill
                  className="object-cover"
                  fallbackClassName="absolute inset-0"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Choose product */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-ink text-cream text-xs flex items-center justify-center font-display">2</span>
            <h3 className="font-display text-lg">Escolha a peça</h3>
          </div>
          <p className="text-muted text-sm">Selecione qual peça deseja experimentar.</p>

          <div className="flex flex-col gap-2 flex-1">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedProduct(p); setResultImage(null); setStatus("idle"); }}
                className={`flex items-center gap-3 p-3 border text-left transition-all ${
                  selectedProduct.id === p.id
                    ? "border-rose bg-rose/5"
                    : "border-border hover:border-gold"
                }`}
              >
                <div className="relative w-14 h-20 bg-cream-dark flex-shrink-0 overflow-hidden">
                  <SafeImage
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover"
                    fallbackClassName="absolute inset-0"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm text-ink">{p.name}</p>
                  <p className="text-muted text-xs mt-0.5">
                    R$ {p.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  {p.badge && (
                    <span className="text-xs bg-rose/30 text-rose-dark px-1.5 py-0.5 mt-1 inline-block">
                      {p.badge}
                    </span>
                  )}
                </div>
                {selectedProduct.id === p.id && (
                  <CheckCircle size={16} className="text-rose flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Result */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-ink text-cream text-xs flex items-center justify-center font-display">3</span>
            <h3 className="font-display text-lg">Resultado</h3>
          </div>
          <p className="text-muted text-sm">
            Veja como a peça fica em você antes de comprar.
          </p>

          <TryOnResultPanel
            status={status}
            resultImage={resultImage}
            errorMsg={errorMsg}
          />

          <button
            onClick={handleTryOn}
            disabled={!userImage || status === "processing" || status === "uploading"}
            className="w-full bg-ink text-cream py-4 text-sm uppercase tracking-widest hover:bg-gold hover:text-ink transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === "processing" || status === "uploading" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Experimentar agora
              </>
            )}
          </button>

          {(resultImage || status === "error") && (
            <button
              onClick={handleReset}
              className="w-full border border-border text-muted py-3 text-sm uppercase tracking-widest hover:border-ink hover:text-ink transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} />
              Recomeçar
            </button>
          )}

          <div className="bg-cream-dark rounded-sm p-3">
            <p className="text-xs text-muted leading-relaxed">
              <strong className="text-ink">Privacidade:</strong> suas fotos são enviadas com
              segurança para geração do provador e não são armazenadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
