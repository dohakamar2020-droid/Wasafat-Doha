import { siteURL } from "@/lib/site";
export const metadata = {
  title: "المجموعات",
  description: "مجموعات تحريرية منتقاة لها مزاج وفكرة.",
  alternates: { canonical: `${siteURL()}/collections` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
