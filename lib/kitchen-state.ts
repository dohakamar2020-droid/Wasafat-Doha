import { z } from "zod";
export const attemptSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().max(100),
  at: z.string().datetime(),
  note: z.string().max(4000),
  rating: z.number().int().min(1).max(5).optional(),
  photo: z.string().max(300).optional(),
  public: z.boolean().optional(),
});
export type Attempt = z.infer<typeof attemptSchema>;
const list = z.array(z.string().max(1200)).max(500);
export const kitchenSchema = z.object({
  saved: list,
  planned: list,
  done: list,
  shopping: list,
  shoppingChecked: list,
  notes: z.record(z.string().max(100), z.string().max(4000)),
  attempts: z.array(attemptSchema).max(500),
});
export type KitchenState = z.infer<typeof kitchenSchema>;
export const emptyKitchen = (): KitchenState => ({
  saved: [],
  planned: [],
  done: [],
  shopping: [],
  shoppingChecked: [],
  notes: {},
  attempts: [],
});
export function mergeGuest(
  local: KitchenState,
  remote: KitchenState,
): KitchenState {
  const union = (a: string[], b: string[]) => [...new Set([...a, ...b])];
  return {
    saved: union(local.saved, remote.saved),
    planned: union(local.planned, remote.planned),
    done: union(local.done, remote.done),
    shopping: union(local.shopping, remote.shopping),
    shoppingChecked: union(local.shoppingChecked, remote.shoppingChecked),
    notes: { ...local.notes, ...remote.notes },
    attempts: [
      ...new Map(
        [...local.attempts, ...remote.attempts].map((a) => [a.id, a]),
      ).values(),
    ],
  };
}

/** A dirty cache without a confirmed baseline must never replace cloud data automatically. */
export function syncDecision(
  cachedRevision: number | null,
  remoteRevision: number,
  pending: boolean,
): "apply" | "push" | "conflict" {
  if (!pending) return "apply";
  return cachedRevision !== null && cachedRevision === remoteRevision
    ? "push"
    : "conflict";
}
