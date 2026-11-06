import type { Metadata } from "next";
import { Suspense } from "react";
import Chat from "./Chat";

export const metadata: Metadata = { title: "مساعد وصفات قمر", description: "اسأل عن مقادير الوصفات والناقص من مطبخك." };
export default function ChatPage() {
  return <Suspense fallback={<div className="wrap page-head">بنجهز المساعد...</div>}><Chat /></Suspense>;
}
