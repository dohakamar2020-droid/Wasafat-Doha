import type { Recipe } from "./data";

// Older catalog entries retain this video-only disclaimer after details are added.
// Remove only that known stale sentence; preserve the recipe description and
// caller-provided reasons, and never alter copy for video-only entries.
export function recipeCardReason(r: Recipe, reason?: string): string | undefined {
  const text = reason || (r.editorsPick ? r.why : undefined);
  if (!text || !r.detail) return text;
  return text.replace(/\s*ترشيح فيديو؛\s*راجعي المصدر للمقادير والخطوات\.?/g, "").trim() || undefined;
}
