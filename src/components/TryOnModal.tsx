"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { X, Upload, Camera, User, Sparkles, Loader2, CheckCircle, RefreshCw } from "lucide-react";
import { useTryOn } from "@/contexts/TryOnContext";
import { resizeForStorage } from "@/lib/imageUtils";
import { applyBackground, BG_CONFIGS, type BgKey } from "@/lib/backgroundRemoval";
import type { Product } from "@/lib/products";

interface Props {
  product: Product;
  onClose: () => void;
}

type Step = "upload" | "confirm" | "submitting" | "done";

// ─── PhotoDropzone ────────────────────────────────────────────────────────────

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

// ─── Background selector (shared between upload + confirm steps) ──────────────

function BgSelector({
  value,
  onChange,
}: {
  value: BgKey;
  onChange: (k: BgKey) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-widest text-muted">Fundo do provador</p>
      <div className="flex gap-2">
        {(Object.entries(BG_CONFIGS) as [BgKey, typeof BG_CONFIGS[BgKey]][]).map(([key, cfg]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 px-3 py-2 border-2 rounded-sm text-xs uppercase tracking-widest transition-all ${
              value === key ? "border-ink text-ink" : "border-border text-muted hover:border-ink/40"
            }`}
          >
            <span
              className="w-5 h-5 rounded-sm border border-black/10 flex-shrink-0"
              style={{ background: cfg.gradient }}
            />
            {cfg.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── TryOnModal ───────────────────────────────────────────────────────────────

export default function TryOnModal({ product, onClose }: Props) {
  const { addJob, avatar, setAvatar } = useTryOn();
  const [step, setStep] = useState<Step>(avatar ? "confirm" : "upload");
  const [background, setBackground] = useState<BgKey>("studio");
  const [processingMsg, setProcessingMsg] = useState("");

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

  const handleBody = useCallback((file: File, preview: string) => {
    setBodyFile(file);
    setBodyPreview(preview);
    setError(null);
  }, []);

  // Core: send composited image to server → Fashn.ai job
  const submitTryOn = async (file: File, previewUrl: string) => {
    const formData = new FormData();
    formData.append("body_image", file);
    formData.append("garment_slug", product.slug);
    formData.append("category", product.tryonCategory);
    formData.append("background", background);

    const res = await fetch("/api/tryon/submit", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok || !data.jobId) throw new Error(data.error || "Erro ao enviar imagens");

    addJob({
      jobId: data.jobId,
      productSlug: product.slug,
      productName: product.name,
      productImage: product.images[0],
      selfiePreview: null,
      bodyPreview: previewUrl,
      timestamp: Date.now(),
      background,
    });
  };

  // First time: remove background → composite on chosen env → save avatar → submit
  const handleCreateAvatar = async () => {
    if (!bodyFile) return;
    setStep("submitting");
    setError(null);
    try {
      // 1. Remove background + composite on chosen environment
      setProcessingMsg("Recortando sua foto…");
      const composited = await applyBackground(bodyFile, background, (label, pct) => {
        setProcessingMsg(`${label} ${pct > 0 ? `${pct}%` : ""}`);
      });

      // 2. Resize + store in sessionStorage
      setProcessingMsg("Salvando avatar…");
      const resized = await resizeForStorage(composited);
      setAvatar(resized);

      // 3. Send composited image to server
      setProcessingMsg("Enviando para o provador…");
      const blob = await fetch(composited).then((r) => r.blob());
      const file = new File([blob], "avatar-bg.jpg", { type: "image/jpeg" });
      await submitTryOn(file, resized);

      setStep("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setStep("upload");
    }
  };

  // Subsequent: re-use stored avatar directly
  const handleUseAvatar = async () => {
    if (!avatar) return;
    setStep("submitting");
    setProcessingMsg("Enviando para o provador…");
    setError(null);
    try {
      const blob = await fetch(avatar).then((r) => r.blob());
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      await submitTryOn(file, avatar);
      setStep("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setStep("confirm");
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
          {/* ── Done ── */}
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

          /* ── Submitting ── */
          ) : step === "submitting" ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <Loader2 size={36} className="text-gold animate-spin" />
              <p className="text-sm text-muted">{processingMsg || "Processando…"}</p>
              {processingMsg.includes("Baixando") && (
                <p className="text-xs text-muted/60 max-w-xs">
                  O modelo de IA é baixado uma única vez e fica salvo no seu dispositivo.
                </p>
              )}
            </div>

          /* ── Confirm (avatar exists) ── */
          ) : step === "confirm" ? (
            <div className="flex flex-col gap-5">
              <p className="text-sm text-muted">
                Seu avatar está pronto! Escolha o fundo e clique em <em>Experimentar</em>.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-widest text-ink font-medium">Seu Avatar</p>
                  <div className="relative aspect-[3/4] bg-cream-dark rounded-sm overflow-hidden">
                    <Image src={avatar!} alt="Seu avatar" fill className="object-cover" unoptimized />
                  </div>
                </div>
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

              <BgSelector value={background} onChange={setBackground} />

              {error && (
                <p className="text-xs text-rose-dark bg-rose/10 px-3 py-2 rounded-sm">{error}</p>
              )}

              <div className="flex gap-3 justify-between items-center pt-2">
                <button
                  onClick={() => { setBodyFile(null); setBodyPreview(null); setStep("upload"); }}
                  className="flex items-center gap-1.5 text-xs text-muted uppercase tracking-widest hover:text-ink transition-colors"
                >
                  <RefreshCw size={11} />
                  Alterar avatar
                </button>
                <button
                  onClick={handleUseAvatar}
                  className="flex items-center gap-2 bg-ink text-cream px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all"
                >
                  <Sparkles size={13} />
                  Experimentar
                </button>
              </div>
            </div>

          /* ── Upload (no avatar yet) ── */
          ) : (
            <div className="flex flex-col gap-5">
              <p className="text-sm text-muted">
                Envie uma foto de corpo inteiro. Vamos recortar sua silhueta e colocá-la no fundo do
                provador escolhido — o resultado fica salvo para você experimentar outras peças.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <PhotoDropzone
                  label="Foto de corpo inteiro"
                  hint="De frente, fundo claro, corpo todo"
                  icon={User}
                  preview={bodyPreview}
                  onFile={handleBody}
                />
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

              <BgSelector value={background} onChange={setBackground} />

              {error && (
                <p className="text-xs text-rose-dark bg-rose/10 px-3 py-2 rounded-sm">{error}</p>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCreateAvatar}
                  disabled={!bodyFile}
                  className="flex items-center gap-2 bg-ink text-cream px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all disabled:opacity-40"
                >
                  <Sparkles size={13} />
                  Criar Avatar e Experimentar
                </button>
              </div>

              <p className="text-xs text-muted/60 text-center">
                🔒 Suas fotos são processadas com segurança e não são armazenadas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
