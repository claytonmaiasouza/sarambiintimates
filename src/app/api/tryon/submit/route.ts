import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { products } from "@/lib/products";

export const maxDuration = 30;

const FASHN_API_KEY = process.env.FASHN_API_KEY;
const FASHN_BASE_URL = "https://api.fashn.ai/v1";

async function resizeToBase64(buffer: Buffer): Promise<string> {
  const resized = await sharp(buffer)
    .rotate()
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
    const garmentSlug = formData.get("garment_slug") as string;
    const category = (formData.get("category") as string) || "tops";

    if (!bodyImageFile) {
      return NextResponse.json({ error: "Foto de corpo inteiro é obrigatória" }, { status: 400 });
    }

    const product = products.find((p) => p.slug === garmentSlug);
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const [modelBase64, garmentBase64] = await Promise.all([
      resizeToBase64(Buffer.from(await bodyImageFile.arrayBuffer())),
      fetch(product.garmentImage)
        .then((r) => r.arrayBuffer())
        .then((b) => resizeToBase64(Buffer.from(b))),
    ]);

    const submitRes = await fetch(`${FASHN_BASE_URL}/run`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FASHN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_name: "tryon-v1.6",
        inputs: { model_image: modelBase64, garment_image: garmentBase64, category, mode: "balanced" },
      }),
    });

    const submitBody = await submitRes.json().catch(() => ({}));

    if (!submitRes.ok) {
      const detail = submitBody?.detail?.[0]?.msg || submitBody?.detail || submitBody?.error || JSON.stringify(submitBody);
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
