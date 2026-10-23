import { notFound } from "next/navigation";
import { getRecipe } from "@/lib/catalog";
import CookExperience from "./CookExperience";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const r = await getRecipe((await params).slug);
  return {
    title: r ? `نطبخ: ${r.title}` : "وضع الطبخ",
    robots: { index: false, follow: true },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const r = await getRecipe((await params).slug);
  if (!r) notFound();
  return <CookExperience r={r} />;
}
