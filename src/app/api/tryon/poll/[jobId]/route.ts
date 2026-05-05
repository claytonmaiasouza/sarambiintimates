import { NextRequest, NextResponse } from "next/server";

const FASHN_API_KEY = process.env.FASHN_API_KEY;
const FASHN_BASE_URL = "https://api.fashn.ai/v1";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  try {
    const res = await fetch(`${FASHN_BASE_URL}/status/${jobId}`, {
      headers: { Authorization: `Bearer ${FASHN_API_KEY}` },
    });

    if (!res.ok) return NextResponse.json({ status: "failed" });

    const data = await res.json();
    return NextResponse.json({
      status: data.status as string,
      outputUrl: (data.output?.[0] as string) ?? null,
    });
  } catch {
    return NextResponse.json({ status: "failed" });
  }
}
