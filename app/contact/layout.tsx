import { siteURL } from "@/lib/site";
export const metadata = {
  title: "تواصل معانا",
  description: "اقتراح وصفة أو تصحيح مقادير أو الإبلاغ عن فيديو لا يعمل.",
  alternates: { canonical: `${siteURL()}/contact` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
