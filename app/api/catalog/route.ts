import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
export async function GET() {
  try {
    return NextResponse.json({ recipes: await getCatalog() });
  } catch {
    return NextResponse.json(
      { error: "المكتبة غير متاحة مؤقتًا." },
      { status: 503 },
    );
  }
}
