"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { X, Camera, Upload, Trash2, User } from "lucide-react";
import { useTryOn } from "@/contexts/TryOnContext";
import { resizeForStorage } from "@/lib/imageUtils";

interface Props { onClose: () => void }

export default function AvatarModal({ onClose }: Props) {
  const { avatar, setAvatar, clearAvatar } = useTryOn();
  const [preview, setPreview] = useState<string | null>(avatar);
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
      <div className="bg-cream w-full max-w-xs shadow-2xl">
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
          <div {...getRootProps()} className="relative aspect-[3/4] bg-cream-dark overflow-hidden rounded-sm border-2 border-dashed border-border">
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

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleRemove}
              className="flex items-center gap-1.5 text-xs text-rose-dark hover:text-rose uppercase tracking-widest transition-colors"
            >
              <Trash2 size={11} />
              Remover
            </button>
            <button
              onClick={handleSave}
              className="bg-ink text-cream px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
