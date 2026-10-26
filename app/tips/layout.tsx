import { siteURL } from "@/lib/site";
export const metadata = {
  title: "أسرار نجاح الأكل",
  description: "نصايح مطبخ عملية عامة: عجين، بشاميل، قرمشة، تتبيلات، حلويات، وتخزين آمن — من تحرير وصفات قمر.",
  alternates: { canonical: `${siteURL()}/tips` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
