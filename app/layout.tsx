import "@fontsource/alexandria/700.css";
import "@fontsource/alexandria/800.css";
import "@fontsource/alexandria/900.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import SyncProvider from "@/components/SyncProvider";
import AuthStatus from "@/components/AuthStatus";
import { Search, Sparkles, Heart, Moon } from "lucide-react";
import { TopNav, BottomBar } from "@/components/NavLinks";
import InstallApp from "@/components/InstallApp";
import CatalogProvider from "@/components/CatalogProvider";
import { getCatalog } from "@/lib/catalog";
import { siteURL } from "@/lib/site";
import RegisterSW from "@/components/RegisterSW";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#34483D",
};
export const metadata: Metadata = {
  metadataBase: new URL(siteURL()),
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "وصفات قمر",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image" },
  title: {
    default: "وصفات قمر | وصفات تستاهل التجربة",
    template: "%s | وصفات قمر",
  },
  description:
    "وصفات قمر — مكتبة عربية منتقاة من فيديوهات وشورتس من نادية السيد وهبة أبو الخير وعبير الصغير وشيف عمر وأبو جوليا. اتفرج، اختار، جهّز، واطبخ من نفس المكان.",
};

function Logo() {
  return (
    <Link href="/" className="logo" aria-label="وصفات قمر — الرئيسية">
      <Moon className="logo-moon" fill="currentColor" aria-hidden="true" />
      <span className="logo-text">
        وصفات <b>قمر</b>
      </span>
    </Link>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const recipes = await getCatalog();
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌙</text></svg>"
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body>
        <CatalogProvider recipes={recipes}>
          <SyncProvider>
            <a className="skip-link" href="#main-content">
              تخطّى إلى المحتوى
            </a>
            <header className="topbar glass">
              <Logo />
              <TopNav />
              <div className="top-actions">
                <Link href="/discover" className="icon-btn" aria-label="البحث">
                  <Search size={20} aria-hidden="true" />
                </Link>
                <Link href="/pick" className="btn btn-primary btn-sm">
                  <Sparkles size={17} aria-hidden="true" /> رشحلي 3
                </Link>
                <Link href="/kitchen/saved" className="btn btn-ghost btn-sm">
                  <Heart size={17} aria-hidden="true" /> محفوظاتي
                </Link>
                <AuthStatus />
              </div>
            </header>

            <RegisterSW />
            <main id="main-content">{children}</main>

            <footer className="footer">
              <div className="footer-inner">
                <div>
                  <Logo />
                  <p className="footer-tag">
                    الإنترنت مليان وصفات. هنا في <b>وصفات قمر</b> جمعنالك اللي
                    تستاهل وقتك ومكوناتك.
                  </p>
                  <p className="footer-note">
                    كل وصفة منسوبة لصاحبها، والفيديو الأصلي على يوتيوب هو المصدر
                    — إحنا بننتقي ونرتّب ونقرّبك من الطبخة.
                  </p>
                  <InstallApp variant="slim" />
                </div>
                <nav aria-label="روابط الاكتشاف والاختيار">
                  <h3>اتفرج واختار</h3>
                  <Link href="/discover">اكتشف الوصفات</Link>
                  <Link href="/watch">الشورتس</Link>
                  <Link href="/pick">رشحلي 3</Link>
                  <Link href="/collections">المجموعات</Link>
                  <Link href="/meals">السفرات</Link>
                  <Link href="/weekly">اختيارات الأسبوع</Link>
                  <Link href="/same-ingredient">نفس المكوّن، 3 تجارب</Link>
                  <Link href="/compare">قارن وصفات</Link>
                </nav>
                <nav aria-label="روابط التجهيز والطبخ">
                  <h3>جهّز واطبخ</h3>
                  <Link href="/ingredients">اكتب اللي عندك</Link>
                  <Link href="/features">كل المزايا</Link>
                  <Link href="/kitchen/shopping">مشترياتي</Link>
                  <Link href="/kitchen/saved">محفوظاتي</Link>
                  <Link href="/passport">جواز سفر المذاق</Link>
                </nav>
                <nav aria-label="روابط الشيفات">
                  <h3>الشيفات</h3>
                  <Link href="/creators/nadia">نادية السيد</Link>
                  <Link href="/creators/heba">هبة أبو الخير</Link>
                  <Link href="/creators/abeer">عبير الصغير</Link>
                  <Link href="/creators/omar">شيف عمر</Link>
                  <Link href="/creators/abujulia">أبو جوليا</Link>
                  <Link href="/creators/aya">آية حبيب</Link>
                  <Link href="/creators/fatma">فاطمة أبو حاتي</Link>
                  <Link href="/creators/om-anwar">أم أنوار</Link>
                </nav>
                <nav aria-label="روابط مطبخي والموقع">
                  <h3>مطبخي والموقع</h3>
                  <Link href="/kitchen">دفتري</Link>
                  <Link href="/kitchen/attempts">تجاربي والبواقي</Link>
                  <Link href="/about">فكرة وصفات قمر ومنهج الانتقاء</Link>
                  <Link href="/privacy">الخصوصية وبياناتك</Link>
                  <Link href="/contact">تواصل وابلاغ عن مصدر</Link>
                  <Link href="/login">تسجيل الدخول والمزامنة</Link>
                </nav>
              </div>
              <p className="footer-bottom">
                🌙 وصفات قمر © 2026 — الوصفات والمقادير والخطوات ملك لأصحابها،
                ودورنا الانتقاء والترتيب.
              </p>
            </footer>

<BottomBar />
          </SyncProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
