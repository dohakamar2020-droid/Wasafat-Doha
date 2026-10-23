import { siteURL } from "@/lib/site";
export const metadata = {
  title: "عندك إيه في البيت؟",
  description: "اكتب المقادير اللي عندك وهنرشحلك وصفات وفيديوهات تنفع بيها، ونقولك الناقص بالظبط عشان تكمل عليه.",
  alternates: { canonical: `${siteURL()}/ingredients` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
