import { siteURL } from "@/lib/site";
export const metadata = {
  title: "رشحلي ٥ بـ٥ مكونات",
  description: "اختار لحد خمسة مكونات وتفضيلاتك، وشوف وصفات وما ينقصها من المقادير.",
  alternates: { canonical: `${siteURL()}/pick-five` },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
