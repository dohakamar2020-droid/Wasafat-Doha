"use client";
import { useEffect, useState } from "react";
import { Download, Moon, Share, CheckCircle2 } from "lucide-react";

// «ثبّت التطبيق»: زرار تثبيت PWA بهوية وصفات قمر.
// - كروم/أندرويد: بيستخدم حدث beforeinstallprompt الحقيقي.
// - آيفون (سفاري): مفيش واجهة تثبيت برمجية، فبنعرض خطوات الشير.
// - متصفحات تانية: خطوات عامة (قائمة المتصفح ← تثبيت).
// ولو التطبيق متثبت أصلًا وفاتح منه، الزرار بيختفي أو يقول «مثبّت».

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

export default function InstallApp({
  variant = "card",
}: {
  variant?: "card" | "slim";
}) {
  const [mounted, setMounted] = useState(false);
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setMounted(true);
    setInstalled(isStandalone());
    setIos(isIOS());
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!mounted) return null;

  const onClick = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setDeferred(null);
      else setShowHelp(false);
      return;
    }
    setShowHelp((v) => !v);
  };

  if (installed)
    return variant === "card" ? (
      <div className="install-card installed" role="status">
        <span className="install-orb ok">
          <CheckCircle2 size={26} aria-hidden="true" />
        </span>
        <span className="install-texts">
          <b>تطبيق وصفات قمر مثبّت عندك ✓</b>
          <small>هتلاقيه على شاشتك الرئيسية وبيفتح على طول</small>
        </span>
      </div>
    ) : null;

  return (
    <div className={`install-wrap ${variant}`}>
      <button
        type="button"
        className="install-card"
        onClick={onClick}
        aria-expanded={showHelp}
        aria-label="ثبّت تطبيق وصفات قمر على شاشتك الرئيسية"
      >
        <span className="install-orb">
          <Download size={26} aria-hidden="true" />
        </span>
        <span className="install-texts">
          <b>ثبّت تطبيق وصفات قمر</b>
          <small>أضِفه لشاشتك الرئيسية — يفتح أسرع ومن غير متصفح</small>
        </span>
        <Moon
          className="install-moon"
          size={20}
          fill="currentColor"
          aria-hidden="true"
        />
      </button>
      {showHelp && (
        <div className="install-help" role="note">
          {ios ? (
            <p>
              من سفاري: دوس زرار المشاركة{" "}
              <Share size={15} aria-hidden="true" /> تحت، وبعده اختار «أضف
              إلى الشاشة الرئيسية» — وهتلاقي قمر على شاشتك.
            </p>
          ) : (
            <p>
              من متصفحك: افتح قائمة المتصفح (⋮) واختار «تثبيت التطبيق» أو
              «أضف إلى الشاشة الرئيسية». لو الخيار لسه مش ظاهر، كمّل تصفح
              شوية وارجع — المتصفح بيقترحه بعد ما يتعرف على استخدامك.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
