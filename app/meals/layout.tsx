import { siteURL } from "@/lib/site";
export const metadata = {
  title: "من وصفة لسفرة",
  description: "أطباق متوافقة ومشتريات متجمعة وترتيب للتجهيز.",
  alternates: { canonical: `${siteURL()}/meals` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
