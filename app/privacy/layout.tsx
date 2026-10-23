import { siteURL } from "@/lib/site";
export const metadata = {
  title: "الخصوصية وبياناتك",
  description: "كيف تحفظ وصفات قمر بيانات الضيف والحساب والتجارب والصور.",
  alternates: { canonical: `${siteURL()}/privacy` },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
