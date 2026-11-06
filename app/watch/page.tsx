import { getCatalog } from "@/lib/catalog";
import WatchFeed from "@/components/WatchFeed";

export const metadata = { title: "الشورتس — شوف الفكرة بسرعة", description: "اتفرج على شورتس وصفات قمر واحفظ أفكارك المفضلة." };
export default async function WatchIndexPage({ searchParams }: { searchParams: Promise<{ cat?: string; start?: string }> }) {
  const recipes = await getCatalog();
  const { cat, start } = await searchParams;
  return <WatchFeed recipes={recipes} initialCategory={cat} initialStart={start} />;
}
