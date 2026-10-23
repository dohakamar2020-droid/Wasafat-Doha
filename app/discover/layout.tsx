import { siteURL } from "@/lib/site";
export const metadata = {
  title: "اكتشف الوصفات",
  description: "ابحث بالعربي وصفّي حسب الشيف والمكوّن والقوام وحالة المراجعة.",
  alternates: { canonical: `${siteURL()}/discover` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
