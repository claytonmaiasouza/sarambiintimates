"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { X, Upload, Camera, User, Sparkles, Loader2, CheckCircle } from "lucide-react";
import { useTryOn } from "@/contexts/TryOnContext";
import type { Product } from "@/lib/products";

interface Props {
  product: Product;
  onClose: () => void;
}

type Step = "selfie" | "body" | "submitting" | "done";

function PhotoDropzone({
  label,
  hint,
  icon: Icon,
  preview,
  onFile,
}: {
  label: string;
  hint: string;
  icon: React.ElementType;
  preview: string | null;
  onFile: (file: File, preview: string) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => onFile(file, e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [onFile]
  );

  const onDrop = useCallback((files: File[]) => { if (files[0]) readFile(files[0]); }, [readFile]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024,
  });

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-widest text-ink font-medium">{label}</p>
      <div
        {...getRootProps()}
        className={`relative aspect-[3/4] border-2 border-dashed rounded-sm overflow-hidden transition-colors ${
          isDragActive ? "border-rose bg-rose/5" : "border-border"
        }`}
      >
        <input {...getInputProps()} />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture={"environment" as unknown as boolean}
          className="hidden"
          onChange={handleCameraChange}
        />
        {preview ? (
          <>
            <Image src={preview} alt={label} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 flex items-end justify-center pb-3 gap-2">
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="flex items-center gap-1.5 bg-ink/80 text-cream px-3 py-1.5 text-xs uppercase tracking-widest hover:bg-ink transition-all rounded-sm"
              >
                <Camera size={11} />
                Câmera
              </button>
              <button
                type="button"
                onClick={open}
                className="flex items-center gap-1.5 bg-ink/80 text-cream px-3 py-1.5 text-xs uppercase tracking-widest hover:bg-ink transition-all rounded-sm"
              >
                <Upload size={11} />
                Galeria
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 text-center">
            <Icon size={24} className="text-muted" />
            <div className="flex flex-col gap-2 w-full max-w-[160px]">
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-ink text-cream py-2.5 text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all w-full"
              >
                <Camera size={13} />
                Câmera
              </button>
              <button
                type="button"
                onClick={open}
                className="flex items-center justify-center gap-2 border border-border text-muted py-2.5 text-xs uppercase tracking-widest hover:border-ink hover:text-ink transition-colors w-full"
              >
                <Upload size={13} />
                Galeria
              </button>
            </div>
            <p className="text-xs text-muted/60">{hint}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TryOnModal({ product, onClose }: Props) {
  const { addJob } = useTryOn();
  const [step, setStep] = useState<Step>("selfie");

  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [bodyFile, setBodyFile] = useState<File | null>(null);
  const [bodyPreview, setBodyPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSelfie = useCallback((file: File, preview: string) => {
    setSelfieFile(file);
    setSelfiePreview(preview);
    setError(null);
  }, []);

  const handleBody = useCallback((file: File, preview: string) => {
    setBodyFile(file);
    setBodyPreview(preview);
    setError(null);
  }, []);

  const handleSubmit = async () => {
    if (!bodyFile) { setError("Adicione a foto de corpo inteiro."); return; }
    setStep("submitting");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("body_image", bodyFile);
      formData.append("garment_slug", product.slug);
      formData.append("category", product.tryonCategory);

      const res = await fetch("/api/tryon/submit", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.jobId) {
        throw new Error(data.error || "Erro ao enviar imagens");
      }

      addJob({
        jobId: data.jobId,
        productSlug: product.slug,
        productName: product.name,
        productImage: product.images[0],
        selfiePreview,
        bodyPreview: bodyPreview!,
        timestamp: Date.now(),
      });

      setStep("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setStep("body");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm">
      <div className="bg-cream w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-widest text-rose font-body">Provador Virtual</p>
            <h2 className="font-display text-xl text-ink">{product.name}</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors p-1">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {step === "done" ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                <CheckCircle size={32} className="text-gold" />
              </div>
              <h3 className="font-display text-2xl text-ink">Enviado com sucesso!</h3>
              <p className="text-muted text-sm max-w-sm">
                Seu provador está sendo preparado.
              </p>
              <div className="flex items-center gap-2 bg-cream-dark px-4 py-3 text-xs text-muted rounded-sm">
                <Sparkles size={13} className="text-gold" />
                Fique à vontade para continuar navegando
              </div>
              <button
                onClick={onClose}
                className="mt-2 bg-ink text-cream px-8 py-3 text-sm uppercase tracking-widest hover:bg-gold hover:text-ink transition-all"
              >
                Continuar navegando
              </button>
            </div>
          ) : step === "submitting" ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <Loader2 size={36} className="text-gold animate-spin" />
              <p className="text-sm text-muted">Enviando suas fotos…</p>
            </div>
          ) : (
            <>
              {/* Step indicator */}
              <div className="flex items-center gap-3 mb-6">
                {(["selfie", "body"] as const).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <button
                      onClick={() => setStep(s)}
                      className={`w-6 h-6 rounded-full text-xs font-display flex items-center justify-center transition-all ${
                        step === s ? "bg-ink text-cream" : "bg-border text-muted"
                      }`}
                    >
                      {i + 1}
                    </button>
                    <span className={`text-xs uppercase tracking-widest ${step === s ? "text-ink" : "text-muted"}`}>
                      {s === "selfie" ? "Selfie" : "Corpo inteiro"}
                    </span>
                    {i === 0 && <span className="text-border mx-1">→</span>}
                  </div>
                ))}
              </div>

              {step === "selfie" && (
                <div className="flex flex-col gap-5">
                  <p className="text-sm text-muted">
                    Tire uma selfie do rosto para personalizar o resultado com as suas feições.
                  </p>
                  <div className="max-w-xs mx-auto w-full">
                    <PhotoDropzone
                      label="Selfie do rosto"
                      hint="Foto de frente com boa iluminação"
                      icon={Camera}
                      preview={selfiePreview}
                      onFile={handleSelfie}
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      onClick={() => setStep("body")}
                      className="text-xs text-muted uppercase tracking-widest hover:text-ink transition-colors"
                    >
                      Pular esta etapa
                    </button>
                    <button
                      onClick={() => setStep("body")}
                      disabled={!selfieFile}
                      className="bg-ink text-cream px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all disabled:opacity-40"
                    >
                      Próximo →
                    </button>
                  </div>
                </div>
              )}

              {step === "body" && (
                <div className="flex flex-col gap-5">
                  <p className="text-sm text-muted">
                    Envie uma foto de corpo inteiro, de frente, com fundo claro e boa iluminação — quanto mais nítida, melhor o resultado.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <PhotoDropzone
                      label="Foto de corpo inteiro"
                      hint="De frente, fundo claro, corpo todo"
                      icon={User}
                      preview={bodyPreview}
                      onFile={handleBody}
                    />
                    {/* Preview produto */}
                    <div className="flex flex-col gap-2">
                      <p className="text-xs uppercase tracking-widest text-ink font-medium">Peça selecionada</p>
                      <div className="relative aspect-[3/4] bg-cream-dark rounded-sm overflow-hidden">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" unoptimized />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/60 to-transparent p-3">
                          <p className="text-cream text-xs font-display">{product.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-rose-dark bg-rose/10 px-3 py-2 rounded-sm">{error}</p>
                  )}

                  <div className="flex gap-3 justify-between pt-2">
                    <button
                      onClick={() => setStep("selfie")}
                      className="text-xs text-muted uppercase tracking-widest hover:text-ink transition-colors"
                    >
                      ← Voltar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!bodyFile}
                      className="flex items-center gap-2 bg-ink text-cream px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all disabled:opacity-40"
                    >
                      <Sparkles size={13} />
                      Experimentar
                    </button>
                  </div>

                  <p className="text-xs text-muted/60 text-center">
                    🔒 Suas fotos são processadas com segurança e não são armazenadas
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
