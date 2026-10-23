import { siteURL } from "@/lib/site";
export const metadata = {
  title: "عن وصفات قمر",
  description: "تعرف على منهج الانتقاء والمراجعة ومصادر وصفات قمر.",
  alternates: { canonical: `${siteURL()}/about` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
