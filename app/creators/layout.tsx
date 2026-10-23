import { siteURL } from "@/lib/site";
export const metadata = {
  title: "الشيفات",
  description: "وصفات منتقاة من مصادر الشيفات الأصلية.",
  alternates: { canonical: `${siteURL()}/creators` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
