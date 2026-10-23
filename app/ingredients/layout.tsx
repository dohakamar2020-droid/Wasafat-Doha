import { siteURL } from "@/lib/site";
export const metadata = {
  title: "عندك إيه في البيت؟",
  description: "طابق مكونات مطبخك مع المقادير المكتوبة للوصفات المكتملة.",
  alternates: { canonical: `${siteURL()}/ingredients` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
