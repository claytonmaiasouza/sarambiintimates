"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { X, Camera, Upload, Trash2, User, Wand2, Loader2 } from "lucide-react";
import { useTryOn } from "@/contexts/TryOnContext";
import { resizeForStorage } from "@/lib/imageUtils";
import { applyBackground, BG_CONFIGS, type BgKey } from "@/lib/backgroundRemoval";

interface Props { onClose: () => void }

export default function AvatarModal({ onClose }: Props) {
  const { avatar, setAvatar, clearAvatar } = useTryOn();

  // Current photo source: either the stored avatar or a newly uploaded one
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(avatar);
  const [background, setBackground] = useState<BgKey>("studio");
  const [processing, setProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState("");
  const [changed, setChanged] = useState(false);

  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  const loadFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setPhotoFile(file);
      setChanged(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback((files: File[]) => { if (files[0]) loadFile(files[0]); }, [loadFile]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024,
  });

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) loadFile(e.target.files[0]);
    e.target.value = "";
  };

  // Remove background + composite on chosen environment
  const handleApplyBackground = async () => {
    const source = photoFile ?? preview;
    if (!source) return;
    setProcessing(true);
    setProcessingMsg("Recortando sua foto…");
    try {
      const composited = await applyBackground(source, background, (label, pct) => {
        setProcessingMsg(`${label} ${pct > 0 ? `${pct}%` : ""}`);
      });
      setPreview(composited);
      setPhotoFile(null); // now working from the composited data URL
      setChanged(true);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao aplicar fundo");
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = async () => {
    if (preview && changed) {
      const resized = await resizeForStorage(preview);
      setAvatar(resized);
    }
    onClose();
  };

  const handleRemove = () => {
    clearAvatar();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm">
      <div className="bg-cream w-full max-w-sm shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-widest text-rose font-body">Provador</p>
            <h2 className="font-display text-xl text-ink">Seu Avatar</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors p-1">
            <X size={22} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-5">
          {/* Avatar preview */}
          <div {...getRootProps()} className="relative aspect-[3/4] bg-cream-dark overflow-hidden rounded-sm border-2 border-dashed border-border cursor-default">
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
              <Image src={preview} alt="Avatar" fill className="object-cover" unoptimized />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
                <User size={36} />
                <p className="text-xs">Nenhuma foto</p>
              </div>
            )}
            {processing && (
              <div className="absolute inset-0 bg-ink/60 flex flex-col items-center justify-center gap-3 text-center px-4">
                <Loader2 size={28} className="text-gold animate-spin" />
                <p className="text-cream text-xs">{processingMsg}</p>
              </div>
            )}
          </div>

          {/* Upload buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => cameraRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 border border-border text-muted py-2.5 text-xs uppercase tracking-widest hover:border-ink hover:text-ink transition-colors"
            >
              <Camera size={12} />
              Câmera
            </button>
            <button
              onClick={open}
              className="flex-1 flex items-center justify-center gap-1.5 border border-border text-muted py-2.5 text-xs uppercase tracking-widest hover:border-ink hover:text-ink transition-colors"
            >
              <Upload size={12} />
              Galeria
            </button>
          </div>

          {/* Background selector */}
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-muted">Fundo do provador</p>
            <div className="flex gap-2">
              {(Object.entries(BG_CONFIGS) as [BgKey, typeof BG_CONFIGS[BgKey]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBackground(key)}
                  className={`flex items-center gap-2 px-3 py-2 border-2 rounded-sm text-xs uppercase tracking-widest transition-all ${
                    background === key ? "border-ink text-ink" : "border-border text-muted hover:border-ink/40"
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
            <button
              onClick={handleApplyBackground}
              disabled={!preview || processing}
              className="flex items-center justify-center gap-2 w-full border border-border text-muted py-2 text-xs uppercase tracking-widest hover:border-ink hover:text-ink transition-colors disabled:opacity-40"
            >
              <Wand2 size={12} />
              Aplicar fundo na foto
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              onClick={handleRemove}
              className="flex items-center gap-1.5 text-xs text-rose-dark hover:text-rose uppercase tracking-widest transition-colors"
            >
              <Trash2 size={11} />
              Remover avatar
            </button>
            <button
              onClick={handleSave}
              disabled={processing}
              className="bg-ink text-cream px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all disabled:opacity-40"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
