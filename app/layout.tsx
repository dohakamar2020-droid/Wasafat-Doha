import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "وصفات قمر | وصفات تستاهل التجربة", template: "%s | وصفات قمر" },
  description: "وصفات قمر — مكتبة عربية منتقاة: 80 فيديو وشورت من نادية السيد وهبة أبو الخير وعبير الصغير وشيف عمر وأبو جوليا. اتفرج، اختار، جهّز، واطبخ من نفس المكان.",
};

function Logo() {
  return (
    <Link href="/" className="logo" aria-label="وصفات قمر — الرئيسية">
      <span className="logo-moon">🌙</span>
      <span className="logo-text">وصفات <b>قمر</b></span>
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌙</text></svg>" />
      </head>
      <body>
        <header className="topbar glass">
          <Logo />
          <nav className="topnav" aria-label="التنقل الرئيسي">
            <Link href="/discover">اكتشف</Link>
            <Link href="/collections">المجموعات</Link>
            <Link href="/creators">الشيفات</Link>
            <Link href="/kitchen">مطبخي</Link>
          </nav>
          <div className="top-actions">
            <Link href="/discover" className="icon-btn" aria-label="البحث">🔍</Link>
            <Link href="/pick" className="btn btn-primary btn-sm">✨ رشحلي 3</Link>
            <Link href="/kitchen/saved" className="btn btn-ghost btn-sm">♥ محفوظاتي</Link>
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="footer-inner">
            <div>
              <Logo />
              <p className="footer-tag">الإنترنت مليان وصفات. هنا في <b>وصفات قمر</b> جمعنالك اللي تستاهل وقتك ومكوناتك.</p>
              <p className="footer-note">كل وصفة منسوبة لصاحبها، والفيديو الأصلي على يوتيوب هو المصدر — إحنا بننتقي ونرتّب ونقرّبك من الطبخة.</p>
            </div>
            <nav aria-label="روابط الموقع">
              <h3>وصفات قمر</h3>
              <Link href="/discover">اكتشف الوصفات</Link>
              <Link href="/pick">رشحلي 3</Link>
              <Link href="/ingredients">عندك إيه في البيت؟</Link>
              <Link href="/collections">المجموعات</Link>
            </nav>
            <nav aria-label="روابط الشيفات">
              <h3>الشيفات</h3>
              <Link href="/creators/nadia">نادية السيد</Link>
              <Link href="/creators/heba">هبة أبو الخير</Link>
              <Link href="/creators/abeer">عبير الصغير</Link>
              <Link href="/creators/omar">شيف عمر</Link>
              <Link href="/creators/abujulia">أبو جوليا</Link>
            </nav>
            <nav aria-label="روابط مطبخي">
              <h3>مطبخي</h3>
              <Link href="/kitchen">دفتري</Link>
              <Link href="/kitchen/saved">محفوظاتي</Link>
              <Link href="/kitchen/shopping">مشترياتي</Link>
              <Link href="/about">فكرة وصفات قمر ومنهج الانتقاء</Link>
            </nav>
          </div>
          <p className="footer-bottom">🌙 وصفات قمر © 2026 — الوصفات والمقادير والخطوات ملك لأصحابها، ودورنا الانتقاء والترتيب.</p>
        </footer>

        <nav className="bottombar glass" aria-label="تنقل الموبايل">
          <Link href="/">🏠<span>الرئيسية</span></Link>
          <Link href="/discover">🔍<span>اكتشف</span></Link>
          <Link href="/pick" className="bottom-pick">✨<span>رشحلي</span></Link>
          <Link href="/kitchen/saved">♥<span>محفوظاتي</span></Link>
          <Link href="/kitchen">🍳<span>مطبخي</span></Link>
        </nav>
      </body>
    </html>
  );
}
