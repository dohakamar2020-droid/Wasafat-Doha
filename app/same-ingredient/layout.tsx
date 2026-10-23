import { siteURL } from "@/lib/site";
export const metadata = {
  title: "نفس المكون، 3 تجارب",
  description: "أفكار متنوعة بالمكون الموجود عندك.",
  alternates: { canonical: `${siteURL()}/same-ingredient` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
