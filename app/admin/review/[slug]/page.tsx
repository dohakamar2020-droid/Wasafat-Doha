import { currentUser, isAdminUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import ContentEditor from "./ContentEditor";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "تحرير ومعاينة الوصفة",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isAdminUser(await currentUser())) notFound();
  return <ContentEditor slug={(await params).slug} />;
}
