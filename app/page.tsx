import { siteURL } from "@/lib/site";
import { trendingNow } from "@/lib/trend";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Flame,
  Snowflake,
  Clock,
  Utensils,
  ChefHat,
  Layers3,
} from "lucide-react";
import { getCatalog } from "@/lib/catalog";
import { creators, ytThumb } from "@/lib/data";
import { diverse, weeklySelection, CAPTURED_AT } from "@/lib/experience";
import { meals, mealRecipes } from "@/lib/meals";
import { RecipeCard, ShortCard, SectionHead } from "@/components/ui";
import FoodImage from "@/components/FoodImage";
import ResumeCooking from "@/components/ResumeCooking";
import SavedStrip from "./SavedStrip";
export const metadata = { alternates: { canonical: siteURL() } };
export default async function Home() {
  const recipes = await getCatalog();
  if (!recipes.length)
    return (
      <div className="wrap">
        <div className="empty">
          <h1>وصفات قمر</h1>
          <p>المكتبة بتتجهز. ارجع قريب للاختيارات الجديدة.</p>
        </div>
      </div>
    );
  const week = weeklySelection(recipes);
  const hero = diverse(
    recipes.filter((r) => r.editorsPick || r.detail),
    3,
  );
  const used = hero.map((r) => r.slug);
  const complete = diverse(
    recipes.filter((r) => r.detail),
    4,
    used,
  );
  used.push(...complete.map((r) => r.slug));
  const discoveries = diverse(
    recipes.filter((r) => r.editorsPick).sort((a, b) => b.views - a.views),
    5,
    used,
  );
  used.push(...discoveries.map((r) => r.slug));
  const shorts = diverse(
    recipes
      .filter((r) => r.sources.some((s) => s.kind === "short"))
      .sort((a, b) => b.views - a.views),
    8,
    used,
  );
  const moods = [
    {
      Icon: Flame,
      title: "قرمشة من أول قطمة",
      sub: "سناكس ولقطات مقرمشة",
      href: "/discover?texture=مقرمش",
    },
    {
      Icon: Snowflake,
      title: "حلو يروّق اليوم",
      sub: "حلويات باردة ومكتملة",
      href: "/discover?cat=حلويات باردة",
    },
    {
      Icon: Clock,
      title: "وقت الطبخ عندك مهم",
      sub: "اختار بشروط واضحة",
      href: "/pick",
    },
    {
      Icon: Utensils,
      title: "من وصفة لسفرة",
      sub: "أطباق ومشتريات وترتيب",
      href: "/meals",
    },
    {
      Icon: ChefHat,
      title: "نفس المكوّن، 3 تجارب",
      sub: "غيّر الطبق بالموجود",
      href: "/same-ingredient",
    },
    {
      Icon: Layers3,
      title: "اختيارات الأسبوع",
      sub: "مجموعة صغيرة تتجدد",
      href: "/weekly",
    },
  ];
  return (
    <>
      <section className="hero">
        <div className="wrap hero-inner">
          <div>
            <span className="eyebrow">وصفات قمر — مكتبة منتقاة بعناية</span>
            <h1>
              وصفة تستاهل تقول:
              <br />
              <em>لازم أجرّبها.</em>
            </h1>
            <p className="hero-sub">
              لقطات مميزة من الشيفات اللي بتحبهم. اختار على مزاجك، جهّز
              بالموجود، وكمّل الطبخة خطوة بخطوة.
            </p>
            <form className="hero-search" action="/discover" role="search">
              <input
                type="search"
                name="q"
                aria-label="ابحث في وصفات قمر"
                placeholder="بطاطس، حلو بارد، عشاء…"
              />
              <button className="btn btn-primary" type="submit">
                <Search size={18} aria-hidden="true" />
                <span>دور</span>
              </button>
            </form>
            <div className="hero-cta">
              <Link className="btn btn-olive" href="/discover">
                اكتشف الوصفات
              </Link>
              <Link className="btn btn-primary" href="/pick">
                <Sparkles size={18} aria-hidden="true" /> رشحلي 3
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <b>{recipes.length}</b>
                <span>وصفة منتقاة</span>
              </div>
              <div>
                <b>{recipes.filter((r) => r.detail).length}</b>
                <span>بمقادير وخطوات</span>
              </div>
              <div>
                <b>{creators.length}</b>
                <span>شيفات في المكتبة</span>
              </div>
              <div>
                <b>{recipes.reduce((n, r) => n + r.sources.length, 0)}</b>
                <span>فيديو وشورت أصلي</span>
              </div>
            </div>
          </div>
          <div className="hero-collage">
            {hero.map((r) => (
              <Link href={`/recipes/${r.slug}`} key={r.slug}>
                <FoodImage
                  src={ytThumb(r.sources[0].ytId)}
                  alt={r.title}
                  width={600}
                  height={450}
                  loading="eager"
                />
                <span>{r.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="wrap">
        <ResumeCooking />
        <section className="block">
          <SectionHead title="على مزاجك" sub="ابدأ من الباب اللي يناسب يومك" />
          <div className="mood-grid">
            {moods.map(({ Icon, ...m }) => (
              <Link className="mood" key={m.href} href={m.href}>
                <Icon size={26} aria-hidden="true" />
                <b>{m.title}</b>
                <span>{m.sub}</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="block">
          <SectionHead
            title="جاهزين للطبخ"
            sub="مقادير مكتوبة، خطوات مرتبة، وعلامات تعرف بيها النتيجة"
            href="/discover?status=reviewed"
            linkText="كل الوصفات المكتملة"
          />
          <div className="grid">
            {complete.map((r) => (
              <RecipeCard
                key={r.slug}
                r={r}
                reason={r.detail?.successTips[0]}
              />
            ))}
          </div>
        </section>
        {trendingNow(recipes).length > 0 && (
          <section className="block">
            <SectionHead
              title="الترند دلوقتي 🔥"
              sub="أحدث الوصفات انتشارًا على يوتيوب من شيفاتنا — المشاهدات مشاهدات يوتيوب وقت آخر رصد، وتاريخ النشر ظاهر في صفحة كل وصفة"
              href="/discover?sort=trend"
              linkText="كل الترند"
            />
            <div className="grid">
              {trendingNow(recipes).slice(0, 4).map((r) => (
                <RecipeCard key={r.slug} r={r} reason={r.why} />
              ))}
            </div>
          </section>
        )}
        <SavedStrip />
        <section className="block">
          <SectionHead
            title="فكرة مختلفة تستاهل التجربة"
            sub="اختيارات متنوعة بين الشيفات — الفيديو الأصلي مرجعك"
            href="/discover"
          />
          <div className="grid">
            {discoveries.map((r) => (
              <RecipeCard key={r.slug} r={r} />
            ))}
          </div>
        </section>
        <section className="block">
          <SectionHead
            title="عندك إيه في البيت؟"
            sub="ابدأ بمكوّن وهنفرّقلك بين التطابق الفعلي وأفكار الفيديو"
            href="/ingredients"
            linkText="افتح المكونات"
          />
          <div className="chip-row">
            {["بطاطس", "دجاج", "بيض", "حليب", "مكرونة", "أرز"].map((i) => (
              <Link
                className="ing-chip"
                key={i}
                href={`/ingredients?ing=${encodeURIComponent(i)}`}
              >
                {i}
              </Link>
            ))}
          </div>
        </section>
        <section className="block">
          <SectionHead
            title="شوف الفكرة بسرعة"
            sub="شورتس للفرجة؛ وقت الطبخ بيتحدد من الوصفة"
            href="/watch"
            linkText="كل الشورتس"
          />
          <div className="shorts-row">
            {shorts.map((r) => (
              <ShortCard key={r.slug} r={r} />
            ))}
          </div>
        </section>
        <section className="block">
          <SectionHead
            title="من وصفة لسفرة"
            sub="أطباق متوافقة، مقادير متجمعة، وترتيب تجهيز"
            href="/meals"
            linkText="كل السفرات"
          />
          <div className="col-grid">
            {meals.map((m) => {
              const list = mealRecipes(m, recipes),
                first = list[0];
              return first ? (
                <Link
                  className="col-card"
                  href={`/meals/${m.slug}`}
                  key={m.slug}
                >
                  <FoodImage
                    src={ytThumb(first.sources[0].ytId)}
                    alt={m.title}
                    loading="lazy"
                    width={480}
                    height={360}
                  />
                  <div>
                    <span className="col-count">{list.length} أطباق</span>
                    <h3>{m.title}</h3>
                    <p>{m.desc}</p>
                  </div>
                </Link>
              ) : null;
            })}
          </div>
        </section>
        <section className="block">
          <SectionHead
            title="اختيارات الأسبوع"
            sub="دورة أسبوعية من الاختيارات التحريرية؛ مش ترتيب ترند لحظي"
            href="/weekly"
            linkText="سبب كل اختيار"
          />
          <div className="grid">
            {week.recipes
              .filter(
                (r) =>
                  !used.includes(r.slug) &&
                  !shorts.some((s) => s.slug === r.slug),
              )
              .slice(0, 3)
              .map((r) => (
                <RecipeCard key={r.slug} r={r} reason={r.why} />
              ))}
          </div>
          <p className="results-note">
            المشاهدات أرقام يوتيوب وقت آخر رصد؛ بيانات الدفعة الأولى بتاريخ{" "}
            {CAPTURED_AT}.
          </p>
        </section>
        <section className="block">
          <SectionHead
            title="الشيفات اللي بتحبهم"
            sub="كل وصفة منسوبة لصاحبها، مع رابط المصدر"
            href="/creators"
          />
          <div className="creator-grid">
            {creators.map((c) => (
              <Link
                className="creator-card"
                key={c.id}
                href={`/creators/${c.id}`}
              >
                <div className="creator-avatar" aria-hidden="true">
                  {c.name.slice(0, 1)}
                </div>
                <h3>{c.name}</h3>
                <p>{c.tagline}</p>
                <span className="tag">
                  {recipes.filter((r) => r.creatorId === c.id).length} وصفة
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
