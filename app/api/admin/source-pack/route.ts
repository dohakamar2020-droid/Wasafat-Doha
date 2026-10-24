import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { error } from "@/lib/http";
import { SOURCE_PACKS } from "@/lib/source-packs";
import {
  parseIngredientLines,
  parseIngredientSections,
  numericRatio,
} from "@/lib/ingredient-parse";

/**
 * حزمة المصدر الرسمي لوصفة واحدة + المقادير المستخرجة منها.
 * الأدمن بيستخدمها في لوحة التحرير: يختار السطر ويحوّله لمقادير بضغطة،
 * من غير ما يكتب رقم من دماغه.
 */
export async function GET(req: Request) {
  const g = await requireAdmin();
  if (g.response) return g.response;
  const slug = new URL(req.url).searchParams.get("slug") || "";
  const pack = SOURCE_PACKS[slug];
  if (!pack)
    return error("مفيش حزمة مصدر مسجّلة للوصفة دي.", 404);
  try {
    const lines = parseIngredientLines(pack.ingredientLines.join("\n"));
    const groups = parseIngredientSections(
      pack.ingredientLines.length
        ? pack.ingredientLines.join("\n")
        : pack.methodLines?.join("\n") || "",
    );
    return NextResponse.json(
      {
        pack,
        parsed: lines,
        groups,
        numericRatio: numericRatio(lines),
        missing: !pack.ingredientLines.length,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error("تعذّر تحليل حزمة المصدر.", 503);
  }
}
