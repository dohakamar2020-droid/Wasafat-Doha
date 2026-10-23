import { siteURL } from "@/lib/site";
export const metadata = {
  title: "اختيارات الأسبوع",
  description: "مجموعة صغيرة متجددة مع سبب اختيار كل وصفة.",
  alternates: { canonical: `${siteURL()}/weekly` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
