import Link from "next/link";
import { recipes, creators, collections, formatViews, ytThumb, allSourcesCount } from "@/lib/data";
import { RecipeCard, ShortCard, SectionHead } from "@/components/ui";
import SavedStrip from "./SavedStrip";

export default function Home() {
  const byViews = [...recipes].sort((a, b) => b.views - a.views);
  const picks = recipes.filter((r) => r.editorsPick).sort((a, b) => b.views - a.views).slice(0, 8);
  const shorts = recipes.filter((r) => r.sources.some((s) => s.kind === "short")).sort((a, b) => b.views - a.views).slice(0, 12);
  const hero = [byViews[0], byViews.find((r) => r.category === "حلويات باردة")!, byViews.find((r) => r.category === "عشاء وسندوتشات")!];
  const featuredCol = collections.find((c) => c.slug === "potato")!;
  const featuredRecipes = featuredCol.recipeSlugs.map((s) => recipes.find((r) => r.slug === s)!).filter(Boolean).slice(0, 4);
  const meals = [
    { name: "غداء عائلي", items: ["potato-bechamel-tray", "tomato-qallaya", "mango-cheesecake"], desc: "رئيسي + جانبي + حلو اختياري" },
    { name: "قعدة آخر الأسبوع", items: ["steak-tortilla", "potato-balloons", "chocolate-truffles-2-ing"], desc: "سندوتشات وسناكس وحلو سريع" },
    { name: "عزومة بسيطة", items: ["shrimp-maqluba", "goulash-meat-rolls", "kunafa-cream"], desc: "شكلها فخم وتحضيرها أوضح مما تتخيل" },
  ];
  const moods = [
    { e: "🍟", t: "عايز حاجة مقرمشة", s: "قرمشة من أول قطمة", q: "/discover?texture=مقرمش" },
    { e: "🍮", t: "نفسي في حلو", s: "بارد أو كيك يفرّح", q: "/discover?cat=حلويات باردة" },
    { e: "⏱️", t: "جعان ومستعجل", s: "اختيارات سريعة", q: "/discover?need=وقت قليل" },
    { e: "🌙", t: "عشاء خفيف التحضير", s: "سندوتشات ولفائف", q: "/discover?cat=عشاء وسندوتشات" },
    { e: "🎉", t: "أكلة للعزومة", s: "شكلها سفرة", q: "/discover?need=مناسبة للعزومات" },
    { e: "🧪", t: "أجرب حاجة مختلفة", s: "برّه المعتاد", q: "/collections/start-here" },
  ];
  const quickIngs = ["بطاطس", "دجاج", "بيض", "حليب", "مكرونة", "جلاش", "لحمة مفرومة", "بسكويت"];

  return (
    <>
      <section className="hero">
        <div className="wrap hero-inner">
          <div>
            <span className="eyebrow">🌙 وصفات قمر — مكتبة منتقاة بعناية</span>
            <h1>الوصفة اللي هتقول عليها: <em>لازم أجرّبها</em></h1>
            <p className="hero-sub">اختيارات مميزة من شيفات بتحبهم، مترتبة على مزاجك ووقتك واللي موجود في مطبخك. اتفرج ← اختار ← جهّز ← اطبخ، من نفس المكان.</p>
            <form className="hero-search" action="/discover" method="get" role="search">
              <input name="q" type="search" placeholder="بتدور على إيه؟ بطاطس، حلو بارد، عشاء سريع…" aria-label="ابحث في وصفات قمر" />
              <button className="btn btn-primary" type="submit">🔍 دور</button>
            </form>
            <div className="hero-cta">
              <Link className="btn btn-olive" href="/discover">اكتشف الوصفات</Link>
              <Link className="btn btn-primary" href="/pick">✨ رشحلي 3</Link>
            </div>
            <div className="hero-stats">
              <div><b>{allSourcesCount}</b><span>فيديو وشورت منتقى</span></div>
              <div><b>{recipes.length}</b><span>وصفة في المكتبة</span></div>
              <div><b>{creators.length}</b><span>شيفات موثوقين</span></div>
              <div><b>{formatViews(recipes.reduce((a, r) => a + r.views, 0))}</b><span>مشاهدة على يوتيوب</span></div>
            </div>
          </div>
          <div className="hero-collage">
            {hero.map((r) => (
              <Link key={r.slug} href={`/recipes/${r.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ytThumb(r.sources[0].ytId)} alt={r.title} />
                <span>{r.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap">
        <SavedStrip />

        <section className="block" aria-labelledby="mood-h">
          <SectionHead title="على مزاجك" sub="قولي مزاجك إيه، ووصفات قمر تضيّق عليك الاختيار" />
          <div className="mood-grid">
            {moods.map((m) => (
              <Link key={m.t} className="mood" href={m.q}><span className="mood-emoji">{m.e}</span><b>{m.t}</b><span>{m.s}</span></Link>
            ))}
          </div>
        </section>

        <section className="block" aria-labelledby="start-h">
          <SectionHead title="ابدأ باللقطات دي" sub="من أقوى الاختيارات في المكتبة — كل واحدة لها سبب واضح" href="/collections/start-here" linkText="مجموعة ابدأ من هنا" />
          <div className="grid">{picks.map((r) => <RecipeCard key={r.slug} r={r} />)}</div>
        </section>

        <section className="block" aria-labelledby="ing-h">
          <SectionHead title="عندك إيه في البيت؟" sub="اختار مكوّن، وهنرشحلك وصفات تناسبه" href="/ingredients" linkText="جرّب مطابقة المكونات" />
          <div className="chip-row">
            {quickIngs.map((i) => <Link key={i} className="ing-chip" href={`/ingredients?ing=${encodeURIComponent(i)}`}>{i}</Link>)}
          </div>
        </section>

        <section className="block" aria-labelledby="col-h">
          <SectionHead title="مجموعة تستاهل تتفتح" sub={featuredCol.desc} href={`/collections/${featuredCol.slug}`} linkText="افتح المجموعة" />
          <div className="grid">{featuredRecipes.map((r) => <RecipeCard key={r.slug} r={r} />)}</div>
        </section>

        <section className="block" aria-labelledby="shorts-h">
          <SectionHead title="شوف الفكرة في دقيقة" sub="شورتس سريعة — دوس على أي واحدة واتفرج من هنا" href="/discover?kind=short" linkText="كل الشورتس" />
          <div className="shorts-row">{shorts.map((r) => <ShortCard key={r.slug} r={r} />)}</div>
        </section>

        <section className="block" aria-labelledby="meals-h">
          <SectionHead title="سفرة جاهزة للاختيار" sub="رئيسي + جانبي + حلو اختياري، من غير ما تحتار" />
          <div className="col-grid">
            {meals.map((m) => {
              const first = recipes.find((r) => r.slug === m.items[0])!;
              return (
                <Link key={m.name} className="col-card" href={`/recipes/${first.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ytThumb(first.sources[0].ytId)} alt={m.name} loading="lazy" />
                  <div><span className="col-count">{m.items.length} أطباق</span><h3>{m.name}</h3><p>{m.desc} — ابدأ بـ{first.title}</p></div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="block" aria-labelledby="creators-h">
          <SectionHead title="من الشيفات اللي بتحبهم" sub="كل وصفة منسوبة لصاحبها ومصدرها الأصلي" href="/creators" linkText="كل الشيفات" />
          <div className="creator-grid">
            {creators.map((c) => {
              const list = recipes.filter((r) => r.creatorId === c.id);
              return (
                <Link key={c.id} className="creator-card" href={`/creators/${c.id}`}>
                  <div className="creator-avatar">{c.name.slice(0, 1)}</div>
                  <h3>{c.name}</h3><p>{c.tagline}</p>
                  <span className="tag tag-views">{list.length} وصفة · 👁 {formatViews(list.reduce((a, r) => a + r.views, 0))}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
