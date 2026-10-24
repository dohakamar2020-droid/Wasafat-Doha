import Link from "next/link";
import {
  Search,
  Sparkles,
  Flame,
  Play,
  Layers3,
  Repeat2,
  CalendarDays,
  GitCompareArrows,
  ShoppingBasket,
  Unlock,
  Utensils,
  Clock3,
  CookingPot,
  Users,
  Target,
  NotebookPen,
  FlaskConical,
  Recycle,
  Map,
  Heart,
  ListChecks,
  LifeBuoy,
  Calculator,
} from "lucide-react";

// «كل المزايا»: دليل واحد لكل اللي وصفات قمر بيقدمه، مرتب على رحلة
// اليوزر نفسها: اتفرج ← اختار ← جهّز ← اطبخ ← كبّر خبرتك. أي فيتشر
// جديد بيتحط هنا في مكانه من الرحلة.

type Feat = {
  Icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" }>;
  title: string;
  desc: string;
  href: string;
  linkText: string;
};
type Group = { title: string; sub: string; feats: Feat[] };

const GROUPS: Group[] = [
  {
    title: "١ · اتفرج",
    sub: "شوف الأفكار بسرعة قبل ما تقرر",
    feats: [
      {
        Icon: Play,
        title: "شورتس وفيديوهات أصلية",
        desc: "كل وصفة مرتبطة بمصدرها على يوتيوب، وتقدر تتفرج من جوه الموقع على طول.",
        href: "/watch",
        linkText: "كل الشورتس",
      },
      {
        Icon: Flame,
        title: "الترند دلوقتي",
        desc: "أحدث الوصفات انتشارًا من شيفات المكتبة، بتاريخ نشر ومشاهدات وقت آخر رصد — من غير أرقام مخترعة.",
        href: "/discover?sort=trend",
        linkText: "شوف الترند",
      },
    ],
  },
  {
    title: "٢ · اختار",
    sub: "قارن وصفات حقيقية ووصل لقرارك",
    feats: [
      {
        Icon: Search,
        title: "اكتشف وابحث",
        desc: "فلاتر بالنوع والحاجة والقوام وحالة المراجعة، وبحث عربي بيفهم المرادفات (فراخ = دجاج).",
        href: "/discover",
        linkText: "افتح الاكتشاف",
      },
      {
        Icon: Sparkles,
        title: "رشحلي 3",
        desc: "٣ أسئلة (مزاجك، وقتك، أولويتك) و٣ ترشيحات بأسباب صادقة — الوقت الموثق بس هو اللي بيتدّعى.",
        href: "/pick",
        linkText: "رشحلي دلوقتي",
      },
      {
        Icon: Layers3,
        title: "المجموعات والسفرات الجاهزة",
        desc: "توليفات محررة وأطباق متوافقة لموقف معين.",
        href: "/collections",
        linkText: "المجموعات",
      },
      {
        Icon: Repeat2,
        title: "نفس المكوّن، ٣ تجارب",
        desc: "عندك مكوّن وعايز تغيّر بيه؟ ٣ طرق مختلفة لنفس الأساس.",
        href: "/same-ingredient",
        linkText: "جرّبها",
      },
      {
        Icon: CalendarDays,
        title: "اختيارات الأسبوع",
        desc: "تشكيلة صغيرة بتتجدد، وسبب كل اختيار مكتوب.",
        href: "/weekly",
        linkText: "اختيارات الأسبوع",
      },
      {
        Icon: GitCompareArrows,
        title: "قارن وصفات",
        desc: "حط وصفتين وتلاتة جنب بعض وقارن المصدر والمكونات والحالة.",
        href: "/compare",
        linkText: "افتح المقارنة",
      },
    ],
  },
  {
    title: "٣ · جهّز",
    sub: "حوّل اختيارك لخطة تجهيز ومشتريات",
    feats: [
      {
        Icon: ShoppingBasket,
        title: "اكتب اللي عندك",
        desc: "اكتب المقادير اللي في مطبخك زي ما بتتكلم، وهنرشحلك على أساسها ونقولك الناقص بالظبط — تدوس عليه لو بقى عندك أو تزوّده لمشترياتك.",
        href: "/ingredients",
        linkText: "عندك إيه في البيت؟",
      },
      {
        Icon: Unlock,
        title: "اشتري حاجة واحدة وافتح وصفات أكتر",
        desc: "من اللي كتبته بنحسب أي مكوّن واحد لو اشتريته هيكمّلك وصفات كام (ومن محفوظاتك كام) — من المقادير الفعلية.",
        href: "/ingredients",
        linkText: "شوف هتفتح إيه",
      },
      {
        Icon: Calculator,
        title: "الوصفة على قد اللي عندي",
        desc: "عدد أفراد، أو «عندي ٢٥٠ جرام فراخ بس»، أو مقاس صينيتك — والمقادير الرقمية بتتحسب بنفس النسبة وبحذر.",
        href: "/discover?status=reviewed",
        linkText: "اختار وصفة مكتملة",
      },
      {
        Icon: Utensils,
        title: "سفرات و«الضيوف جايين الساعة ٨»",
        desc: "اختار سفرة ووقت التقديم وعدد الأفران، وهنطلّعلك ترتيب تنفيذ محسوب بالعكس من الأوقات الموثقة.",
        href: "/meals",
        linkText: "كل السفرات",
      },
      {
        Icon: ListChecks,
        title: "قايمة مشتريات مجمّعة",
        desc: "مقادير الوصفة أو السفرة كلها في قايمة واحدة تقدر تعلّم عليها وانت بتشتري.",
        href: "/kitchen/shopping",
        linkText: "مشترياتي",
      },
    ],
  },
  {
    title: "٤ · اطبخ",
    sub: "تنفيذ خطوة بخطوة من غير ما تضيع",
    feats: [
      {
        Icon: CookingPot,
        title: "وضع الطبخ والمؤقتات",
        desc: "خطوات مركزة واحدة واحدة، مؤقتات متعددة بتنبّهك، والشاشة تفضل صاحية.",
        href: "/discover?status=reviewed",
        linkText: "ابدأ طبخة",
      },
      {
        Icon: Target,
        title: "ورّيني القوام الصح",
        desc: "في كل خطوة علامة النتيجة المطلوبة، وزر بيودّيك للحظة الفيديو نفسها تقريبًا.",
        href: "/discover?status=reviewed",
        linkText: "في وضع الطبخ",
      },
      {
        Icon: Users,
        title: "نطبخها سوا",
        desc: "قسموا شغل الخطوات بين اتنين في نفس المطبخ، كل واحد يعلّم على اللي خلصه.",
        href: "/discover?status=reviewed",
        linkText: "من وضع طبخ أي وصفة",
      },
      {
        Icon: Clock3,
        title: "كمّل من حيث وقفت",
        desc: "آخر طبخة وخطوتك محفوظين — ارجع كمّل من نفس النقطة.",
        href: "/",
        linkText: "من الرئيسية",
      },
      {
        Icon: LifeBuoy,
        title: "مساعدة وقت الطبخ (SOS)",
        desc: "نصايح عامة موسومة بوضوح لما حاجة تعلّق معاك في نص الطبخة.",
        href: "/discover?status=reviewed",
        linkText: "داخل صفحات الوصفات",
      },
    ],
  },
  {
    title: "٥ · كبّر خبرتك",
    sub: "الوصفة تبقى نسختك وذاكرتك",
    feats: [
      {
        Icon: Heart,
        title: "محفوظاتي ومطبخي",
        desc: "احفظ اللي عجبك، وخطط أسبوعك، وكل بياناتك بتتزامن بين أجهزتك لو سجلت دخول.",
        href: "/kitchen",
        linkText: "افتح مطبخي",
      },
      {
        Icon: NotebookPen,
        title: "دي نسختي",
        desc: "سجّل تعديلاتك المنظمة (سكر، جبنة، صينية، فرن) وهتلاقي نسختك الأخيرة جنب وصفة الشيف كل مرة.",
        href: "/discover?status=reviewed",
        linkText: "داخل أي وصفة مكتملة",
      },
      {
        Icon: FlaskConical,
        title: "الترند تحت التجربة",
        desc: "سجّل وقتك الفعلي وأصعب نقطة وحكمك («تستاهل الضجة؟») — وهتلاقي حكمك على كارت الوصفة.",
        href: "/discover?sort=trend",
        linkText: "جرّب واحكم بنفسك",
      },
      {
        Icon: Recycle,
        title: "طبخة النهارده تكمّل بكرة",
        desc: "سجّل اللي فضل منك (ني ولا مستوي) وهنقترح وصفات تستخدمه مع تنبيه التعديل الصح.",
        href: "/kitchen/attempts",
        linkText: "من دفتر تجاربي",
      },
      {
        Icon: Map,
        title: "جواز سفر المذاق",
        desc: "مسارات متدرجة من ٣ وصفات مراجعة، وكل تجربة تسجلها بتبقى ختم بتاريخها في جوازك.",
        href: "/passport",
        linkText: "افتح جوازي",
      },
    ],
  },
];

export const metadata = {
  title: "كل المزايا",
  description:
    "دليل كل اللي تقدر تعمله في وصفات قمر: اكتشاف وترشيحات، كتابة اللي عندك، حساب كميات، سفرات بمواعيد، وضع طبخ، نسختك الخاصة، وجواز سفر المذاق.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="eyebrow">🗺️ دليل وصفات قمر</span>
        <h1>كل اللي تقدر تعمله هنا</h1>
        <p>
          الموقع مش مكتبة وصفات وخلاص — دي رحلة: اتفرج، اختار، جهّز،
          اطبخ، وبعده كبّر خبرتك. كل ميزة مكانها في خطوة من الرحلة:
        </p>
        <div className="chip-row" aria-label="خطوات الرحلة">
          {GROUPS.map((g, i) => (
            <a className="ing-chip" key={g.title} href={`#feat-group-${i}`}>
              {g.title}
            </a>
          ))}
        </div>
      </div>
      {GROUPS.map((g, i) => (
        <section
          className="block"
          key={g.title}
          id={`feat-group-${i}`}
          aria-labelledby={`feat-h-${i}`}
        >
          <div className="section-head">
            <div>
              <h2 id={`feat-h-${i}`}>{g.title}</h2>
              <p>{g.sub}</p>
            </div>
          </div>
          <div className="feat-grid">
            {g.feats.map(({ Icon, ...f }) => (
              <article className="feat-card" key={f.title}>
                <span className="feat-icon">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <Link className="text-link" href={f.href}>
                  {f.linkText} ←
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}
      <section className="surface">
        <h2>مش لاقي حاجة؟</h2>
        <p>
          جرّب البحث من فوق، أو ابدأ بـ
          <Link className="text-link" href="/pick">
            {" "}
            رشحلي 3{" "}
          </Link>
          لو محتار، أو
          <Link className="text-link" href="/ingredients">
            {" "}
            اكتب اللي عندك{" "}
          </Link>
          لو مطبخك هو اللي هيقرر. ولو فيه حاجة ناقصاك،{" "}
          <Link className="text-link" href="/contact">
            قللنا
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
