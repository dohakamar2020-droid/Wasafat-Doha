import { siteURL } from "@/lib/site";
export const metadata = {
  title: "رشحلي 3",
  description: "اختيارات قليلة تحترم ذوقك ووقتك وأدوات مطبخك.",
  alternates: { canonical: `${siteURL()}/pick` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
