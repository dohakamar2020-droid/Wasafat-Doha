"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, Moon, Share, CheckCircle2, X } from "lucide-react";

// «ثبّت التطبيق»: زرار عائم صغير بهوية وصفات قمر بيكبر لما يتداس عليه،
// ومرفوع فوق الناف بار السفلي عشان ما يعملش أي تداخل معاه.
// - كروم/أندرويد: بيستخدم حدث beforeinstallprompt الحقيقي.
// - آيفون (سفاري): مفيش واجهة تثبيت برمجية، فبنعرض خطوات الشير بوضوح.
// - متصفحات تانية: خطوات عامة صادقة (قائمة المتصفح ← تثبيت).
// ولو التطبيق متثبت أصلًا وفاتح منه (standalone)، الزرار بيختفي تمامًا.

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}
function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export default function InstallApp() {
  const pathname = usePathname();
  const wrapRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStandalone(isStandalone());
    setIos(isIOS());
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => {
      setJustInstalled(true);
      setDeferred(null);
      setExpanded(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  useEffect(() => {
    if (!justInstalled) return;
    const timer = window.setTimeout(() => setStandalone(true), 4500);
    return () => window.clearTimeout(timer);
  }, [justInstalled]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [expanded]);

  if (!mounted || standalone) return null;

  const aboveCookNav = pathname?.endsWith("/cook") ?? false;

  const onInstallClick = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      setDeferred(null);
    }
  };

  return (
    <aside
      ref={wrapRef}
      className={`install-float${aboveCookNav ? " above-cook-nav" : ""}${expanded ? " is-open" : ""}`}
      aria-label="تثبيت تطبيق وصفات قمر"
    >
      {justInstalled ? (
        <div className="install-panel installed" role="status">
          <div className="install-panel-head">
            <span className="install-orb ok">
              <CheckCircle2 size={22} aria-hidden="true" />
            </span>
            <span className="install-texts">
              <b>تطبيق وصفات قمر مثبّت عندك ✓</b>
              <small>هتلاقيه على شاشتك الرئيسية وبيفتح على طول</small>
            </span>
            <button
              type="button"
              className="install-close"
              onClick={() => setStandalone(true)}
              aria-label="إغلاق"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : !expanded ? (
        <button
          type="button"
          className="install-fab"
          onClick={() => setExpanded(true)}
          aria-expanded={false}
          aria-controls="install-app-panel"
          aria-label="ثبّت تطبيق وصفات قمر"
          title="ثبّت تطبيق وصفات قمر"
        >
          <span className="install-fab-badge" aria-hidden="true">
            <Moon size={10} fill="currentColor" />
          </span>
          <Download size={20} aria-hidden="true" />
        </button>
      ) : (
        <div
          id="install-app-panel"
          className="install-panel"
          role="dialog"
          aria-label="ثبّت تطبيق وصفات قمر"
        >
          <div className="install-panel-head">
            <span className="install-orb">
              <Download size={21} aria-hidden="true" />
            </span>
            <span className="install-texts">
              <b>ثبّت تطبيق وصفات قمر</b>
              <small>أضِفه لشاشتك الرئيسية — يفتح أسرع ومن غير متصفح</small>
            </span>
            <button
              type="button"
              className="install-close"
              onClick={() => setExpanded(false)}
              aria-expanded={true}
              aria-controls="install-app-panel"
              aria-label="تصغير نافذة تثبيت التطبيق"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="install-panel-body">
            {deferred ? (
              <button
                type="button"
                className="btn btn-primary btn-sm install-cta"
                onClick={onInstallClick}
              >
                <Download size={17} aria-hidden="true" />
                ثبّت التطبيق الآن
              </button>
            ) : ios ? (
              <p className="install-help">
                من سفاري: دوس زرار المشاركة{" "}
                <Share size={15} aria-hidden="true" /> تحت، وبعده اختار «أضف
                إلى الشاشة الرئيسية» — وهتلاقي قمر على شاشتك.
              </p>
            ) : (
              <p className="install-help">
                من متصفحك: افتح قائمة المتصفح (⋮) واختار «تثبيت التطبيق» أو
                «أضف إلى الشاشة الرئيسية». لو الخيار لسه مش ظاهر، كمّل تصفح
                شوية وارجع.
              </p>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
