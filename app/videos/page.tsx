import { getCatalog } from "@/lib/catalog";
import VideoLibrary from "@/components/VideoLibrary";
export const metadata = { title: "الفيديوهات", description: "مكتبة فيديوهات الوصفات من أصحابها على يوتيوب." };
export default async function VideosPage() {
  const recipes = await getCatalog();
  return <VideoLibrary recipes={recipes.sort((a, b) => b.views - a.views)} />;
}
