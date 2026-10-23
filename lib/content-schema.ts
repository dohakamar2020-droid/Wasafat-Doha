import { z } from "zod";
export const ingredientSchema = z.object({
  name: z.string().trim().min(1).max(180),
  display: z.string().trim().min(1).max(300),
  amount: z.number().positive().max(100000).optional(),
  unit: z.string().max(40).optional(),
  optional: z.boolean().optional(),
});
export const detailSchema = z.object({
  servings: z.string().min(1).max(200),
  tools: z.array(z.string().min(1).max(150)).min(1).max(40),
  ingredients: z
    .array(
      z.object({
        group: z.string().min(1).max(100),
        items: z.array(ingredientSchema).min(1).max(80),
      }),
    )
    .min(1)
    .max(20),
  steps: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        body: z.string().min(1).max(4000),
        cue: z.string().max(500).optional(),
        minutes: z.number().int().positive().max(10080).optional(),
        ingredients: z.array(z.string().max(180)).optional(),
      }),
    )
    .min(1)
    .max(60),
  successTips: z.array(z.string().max(1000)).min(1).max(30),
  commonMistakes: z.array(z.string().max(1000)).min(1).max(30),
  reviewNote: z.string().min(20).max(2000),
});
export const sourceSchema = z.object({
  ytId: z.string().regex(/^[\w-]{11}$/),
  kind: z.enum(["video", "short"]),
  published: z.string().regex(/^(0[1-9]|1[0-2])\/20\d{2}$/),
  views: z.number().int().min(0).max(2147483647),
  sourceNo: z.number().int().nonnegative().default(0),
  embeddable: z.boolean().default(true),
});
export const contentSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(100),
  title: z.string().trim().min(3).max(200),
  creatorId: z.enum(["nadia", "heba", "abeer", "omar", "abujulia"]),
  category: z.string().min(1).max(100),
  mainIngredients: z.array(z.string().min(1).max(100)).max(60),
  textures: z.array(z.string().max(100)).max(20),
  needs: z.array(z.string().max(100)).max(20),
  why: z.string().min(15).max(2000),
  editorsPick: z.boolean(),
  stage: z.enum(["draft", "review", "ready", "published", "archived"]),
  detail: detailSchema.nullable(),
  totalMinutes: z.number().int().positive().max(10080).nullable(),
  testedNote: z.string().max(2000).nullable(),
  sources: z.array(sourceSchema).min(1).max(10),
  version: z.number().int().nonnegative(),
});
