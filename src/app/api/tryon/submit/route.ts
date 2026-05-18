import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { products } from "@/lib/products";

export const maxDuration = 30;

const FASHN_API_KEY = process.env.FASHN_API_KEY;
const FASHN_BASE_URL = "https://api.fashn.ai/v1";

const BG_COLORS: Record<string, { r: number; g: number; b: number }> = {
  studio:   { r: 240, g: 240, b: 242 }, // neutral cool white
  elegante: { r: 240, g: 228, b: 210 }, // warm parchment
};

async function resizeOnBackground(
  buffer: Buffer,
  bgKey: string
): Promise<string> {
  const bg = BG_COLORS[bgKey] ?? BG_COLORS.studio;

  // Rotate (EXIF) + resize to fit inside 768×1024
  const modelResized = await sharp(buffer)
    .rotate()
    .resize(768, 1024, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();

  // Get actual dimensions after resize
  const { width: w = 768, height: h = 1024 } = await sharp(modelResized).metadata();

  // Place on solid background so AI inherits the environment colour
  const left = Math.round((768 - w) / 2);
  const top  = Math.round((1024 - h) / 2);

  const composed = await sharp({
    create: { width: 768, height: 1024, channels: 3, background: bg },
  })
    .jpeg({ quality: 90 })
    .toBuffer();

  const final = await sharp(composed)
    .composite([{ input: modelResized, left, top }])
    .jpeg({ quality: 85 })
    .toBuffer();

  return `data:image/jpeg;base64,${final.toString("base64")}`;
}

async function urlToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar imagem da peça: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const resized = await sharp(buf)
    .resize(768, 1024, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  return `data:image/jpeg;base64,${resized.toString("base64")}`;
}

export async function POST(request: NextRequest) {
  if (!FASHN_API_KEY) {
    return NextResponse.json({ error: "API não configurada" }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const bodyImageFile = formData.get("body_image") as File | null;
    const garmentSlug   = formData.get("garment_slug") as string;
    const category      = (formData.get("category") as string) || "tops";
    const background    = (formData.get("background") as string) || "studio";

    if (!bodyImageFile) {
      return NextResponse.json({ error: "Foto de corpo inteiro é obrigatória" }, { status: 400 });
    }

    const product = products.find((p) => p.slug === garmentSlug);
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const modelBuffer = Buffer.from(await bodyImageFile.arrayBuffer());

    const [modelBase64, garmentBase64] = await Promise.all([
      resizeOnBackground(modelBuffer, background),
      urlToBase64(product.garmentImage),
    ]);

    const submitRes = await fetch(`${FASHN_BASE_URL}/run`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FASHN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_name: "tryon-v1.6",
        inputs: {
          model_image: modelBase64,
          garment_image: garmentBase64,
          category,
          mode: "quality",
          segmentation_free: false,
        },
      }),
    });

    const submitBody = await submitRes.json().catch(() => ({}));

    if (!submitRes.ok) {
      const detail =
        submitBody?.detail?.[0]?.msg ||
        submitBody?.detail ||
        submitBody?.error ||
        JSON.stringify(submitBody);
      return NextResponse.json({ error: `Fashn.ai ${submitRes.status}: ${detail}` }, { status: 502 });
    }

    const { id: jobId } = submitBody;
    if (!jobId) return NextResponse.json({ error: "Job ID não retornado" }, { status: 502 });

    return NextResponse.json({ jobId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
