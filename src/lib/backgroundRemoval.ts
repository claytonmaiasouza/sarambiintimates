// Client-side background removal + compositing on chosen environment
// Uses @imgly/background-removal (WebAssembly, no external API key needed).
// Model weights (~30 MB) are fetched from CDN and cached in IndexedDB.

export const BG_CONFIGS = {
  studio: {
    label: "Estúdio",
    description: "Fundo neutro",
    color: "#E8E8EA",
    gradient: "linear-gradient(180deg, #E8E8EA 0%, #E8E8EA 58%, #CCCAC6 100%)",
    wall: "rgb(232,232,234)",
    floor: "rgb(204,202,198)",
  },
  elegante: {
    label: "Boutique",
    description: "Fundo creme quente",
    color: "#EDE4D6",
    gradient: "linear-gradient(180deg, #EDE4D6 0%, #EDE4D6 58%, #C8B8A0 100%)",
    wall: "rgb(237,228,214)",
    floor: "rgb(200,184,160)",
  },
} as const;

export type BgKey = keyof typeof BG_CONFIGS;

function compositeOnBg(personBlob: Blob, bgKey: string): Promise<string> {
  const bg = BG_CONFIGS[bgKey as BgKey] ?? BG_CONFIGS.studio;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(personBlob);
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      // Gradient: wall colour top 58%, floor colour bottom 42%
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, bg.wall);
      grad.addColorStop(0.58, bg.wall);
      grad.addColorStop(1, bg.floor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Erro ao carregar imagem")); };
    img.src = url;
  });
}

export type ProgressCallback = (label: string, pct: number) => void;

export async function applyBackground(
  source: File | Blob | string,
  bgKey: string,
  onProgress?: ProgressCallback
): Promise<string> {
  // Lazy-load to keep initial bundle small
  const { removeBackground } = await import("@imgly/background-removal");

  const transparentBlob = await removeBackground(source, {
    publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/dist/",
    output: { format: "image/png", quality: 1.0 },
    progress: (key: string, current: number, total: number) => {
      if (!onProgress || total === 0) return;
      const pct = Math.round((current / total) * 100);
      const label = key.startsWith("fetch") ? "Baixando modelo de IA…" : "Recortando pessoa…";
      onProgress(label, pct);
    },
  });

  return compositeOnBg(transparentBlob, bgKey);
}
