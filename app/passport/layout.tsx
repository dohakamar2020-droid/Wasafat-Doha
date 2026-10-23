import { siteURL } from "@/lib/site";
export const metadata = {
  title: "جواز سفر المذاق",
  description: "مسارات طبخ متدرجة من وصفات مراجعة — كل تجربة تسجلها بتبقى ختم في جوازك.",
  alternates: { canonical: `${siteURL()}/passport` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
