import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { products } from "@/lib/products";

export const maxDuration = 60; // Vercel Hobby plan max

const FASHN_API_KEY = process.env.FASHN_API_KEY;
const FASHN_BASE_URL = "https://api.fashn.ai/v1";

async function pollForResult(jobId: string, maxAttempts = 18): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const res = await fetch(`${FASHN_BASE_URL}/status/${jobId}`, {
      headers: { Authorization: `Bearer ${FASHN_API_KEY}` },
    });

    if (!res.ok) throw new Error("Falha ao verificar status");

    const data = await res.json();
    console.log(`[tryon] poll ${i + 1}/${maxAttempts} status=${data.status}`);

    if (data.status === "completed" && data.output?.length) return data.output[0];
    if (data.status === "failed") {
      const errMsg = data.error?.message || data.error?.name || data.error || "Processamento falhou";
      throw new Error(String(errMsg));
    }
  }
  throw new Error("Tempo limite excedido. Tente novamente.");
}

async function resizeToBase64(buffer: Buffer, label: string): Promise<string> {
  const resized = await sharp(buffer)
    .rotate()
    .resize(768, 1024, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  const b64 = `data:image/jpeg;base64,${resized.toString("base64")}`;
  console.log(`[tryon] ${label} resized=${Math.round(resized.length / 1024)}KB b64=${Math.round(b64.length / 1024)}KB`);
  return b64;
}

async function urlToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar imagem da peça: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return resizeToBase64(Buffer.from(arrayBuffer), "garment");
}

async function bufferToBase64(arrayBuffer: ArrayBuffer): Promise<string> {
  const buffer = Buffer.from(arrayBuffer);
  return resizeToBase64(buffer, "model");
}

export async function POST(request: NextRequest) {
  if (!FASHN_API_KEY) {
    return NextResponse.json(
      { error: "Provador não configurado. Adicione FASHN_API_KEY no .env.local." },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const modelImageFile = formData.get("model_image") as File | null;
    const garmentSlug = formData.get("garment_slug") as string;
    const category = (formData.get("category") as string) || "tops";

    console.log(`[tryon] garment_slug=${garmentSlug} category=${category}`);

    if (!modelImageFile) {
      return NextResponse.json({ error: "Imagem da modelo é obrigatória" }, { status: 400 });
    }

    const product = products.find((p) => p.slug === garmentSlug);
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const modelBuffer = await modelImageFile.arrayBuffer();
    const [modelBase64, garmentBase64] = await Promise.all([
      bufferToBase64(modelBuffer),
      urlToBase64(product.garmentImage),
    ]);

    const payload = {
      model_name: "tryon-v1.6",
      inputs: {
        model_image: modelBase64,
        garment_image: garmentBase64,
        category,
        mode: "balanced",
      },
    };

    console.log(`[tryon] submitting to fashn.ai...`);

    const submitRes = await fetch(`${FASHN_BASE_URL}/run`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FASHN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const submitBody = await submitRes.json().catch(() => ({}));
    console.log(`[tryon] fashn.ai response status=${submitRes.status}`, JSON.stringify(submitBody).slice(0, 1000));

    if (!submitRes.ok) {
      const detail =
        submitBody?.detail?.[0]?.msg ||
        submitBody?.detail ||
        submitBody?.error ||
        submitBody?.message ||
        JSON.stringify(submitBody);
      throw new Error(`Fashn.ai ${submitRes.status}: ${detail}`);
    }

    const { id: jobId } = submitBody;
    if (!jobId) throw new Error("ID do job não retornado pela API");

    console.log(`[tryon] job=${jobId} polling...`);
    const outputUrl = await pollForResult(jobId);
    return NextResponse.json({ output: outputUrl });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro interno";
    console.error("[tryon] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
