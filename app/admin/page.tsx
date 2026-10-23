import Link from "next/link";
import { currentUser, isAdminUser } from "@/lib/auth";
import AdminConsole from "./AdminConsole";
export const metadata = {
  title: "إدارة المحتوى",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Page() {
  const u = await currentUser();
  if (!isAdminUser(u))
    return (
      <div className="wrap">
        <div className="page-head">
          <h1>إدارة وصفات قمر</h1>
          <p>الصفحة متاحة للحسابات المصرّح لها بإدارة المحتوى.</p>
        </div>
        <Link className="btn btn-primary" href="/login">
          تسجيل الدخول
        </Link>
      </div>
    );
  return <AdminConsole />;
}
