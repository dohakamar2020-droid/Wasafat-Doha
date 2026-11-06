import { normalizeAr, searchRecipes, type Recipe } from "./data";
import { substituteFor, SUBSTITUTE_DISCLAIMER } from "./substitutes";

export type ChatAnswer = { text: string; recipeSlugs?: string[]; recipeSlug?: string };
const norm = (s: string) => normalizeAr(s).replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
const cleanKey = (s: string) => {
  const n = norm(s).replace(/^ال(?=\S)/, "");
  return ({ فراخ: "دجاج", فرخه: "دجاج", لبن: "حليب", طحين: "دقيق" } as Record<string, string>)[n] || n;
};
const words = (s: string) => ` ${norm(s)} `;
function containsName(question: string, name: string) {
  const n = norm(name);
  return !!n && (words(question).includes(` ${n} `) || words(question).includes(` ال${n} `));
}
function matchingItem(question: string, r: Recipe) {
  const items = r.detail?.ingredients.flatMap(g => g.items) || [];
  return [...items].sort((a, b) => b.name.length - a.name.length).find(i => {
    if (containsName(question, i.name)) return true;
    const key = cleanKey(i.name);
    // Alias matching only for complete single names, never generic "milk" for milk powder.
    return (key === "حليب" && containsName(question, "لبن")) ||
      (key === "دجاج" && containsName(question, "فراخ")) ||
      (key === "دقيق" && containsName(question, "طحين"));
  });
}
function listedIngredients(r: Recipe) {
  return r.detail!.ingredients.map(g => `${g.group}:\n${g.items.map(i => `• ${i.name}: ${i.display}${i.optional ? " (اختياري)" : ""}`).join("\n")}`).join("\n\n");
}
function missingReply(question: string, r: Recipe): string {
  if (!r.detail) return "الوصفة دي ترشيح فيديو، ومقاديرها الكاملة مش مكتوبة عندنا؛ مش هقدر أحدد الناقص. افتح صفحة الوصفة وراجع الفيديو الأصلي.";
  const raw = question.match(/(?:موجود\s+عندي|عندي|معايا|عندنا)\s+(.+)/)?.[1];
  if (!raw) return "اكتب الموجود عندك بعد كلمة «عندي»، مثل: عندي دجاج وبصل. هقارن الأسماء بالمقادير المكتوبة، مش الكميات.";
  const available = raw.replace(/[؟?].*$/, "").replace(/\s+(?:ايه|إيه|إيش|شو)\s+(?:الناقص|ناقص).*$/, "").replace(/\s+ناقص(?:ني)?(?:\s+ايه|\s+إيه)?.*$/, "")
    .split(/[،,؛;\n]+|\s+و\s*|\s+مع\s+/).map(cleanKey).filter(Boolean);
  const required = r.detail.ingredients.flatMap(g => g.items).filter(i => !i.optional);
  const unmatched = required.filter(i => !i.name.split(/\s+أو\s+/).some(n => available.includes(cleanKey(n))));
  const optional = r.detail.ingredients.flatMap(g => g.items).filter(i => i.optional);
  return `قارنت أسماء الموجود اللي كتبته بمقادير «${r.title}». المقادير دي مش مؤكّد وجودها عندك:\n${unmatched.length ? unmatched.map(i => `• ${i.name}: ${i.display}`).join("\n") : "• لم أجد مقادير مطلوبة غير مطابقة بالاسم."}${optional.length ? `\n\nمقادير اختيارية للمراجعة: ${optional.map(i => i.name).join("، ")}.` : ""}\n\nالمطابقة تقريبية وبالاسم فقط؛ ممكن اختلاف الكتابة يخلي حاجة موجودة تظهر ناقصة. راجع كل المقادير والكميات والمصدر، ومش ضمان للحساسية.`;
}

/** A bounded, retrieval-based assistant. It never generates undocumented recipe details. */
export function answerChat(question: string, catalog: Recipe[], selectedSlug?: string, preferSelected = false): ChatAnswer {
  const q = question.trim();
  if (!q) return { text: "اكتب سؤالك الأول." };
  if (/حساسي|حساسيه|حامل|رضيع|طفل|تسمم|سكر الدم|سكرى|سكري|جلوتين|غلوتين/.test(norm(q))) return { text: "لو عندك حساسية أو احتياج صحي، ما تعتمدش على المطابقة أو البدائل هنا؛ راجع كل المكونات والمصدر واستشر مختصًا مؤهلًا. الموقع مش ضمان لغياب مسببات الحساسية." };
  const explicit = catalog.filter(r => norm(r.title).length >= 5 && norm(q).includes(norm(r.title)));
  const selected = catalog.find(r => r.slug === selectedSlug);
  const r = preferSelected && selected ? selected : explicit.length === 1 ? explicit[0] : selected;
  const wantsMissing = /عندي|معايا|عندنا|ناقص|موجود/.test(norm(q));
  const wantsSub = /بديل|استبدل|بدل|اعوض|مش موجود|مافيش|مفيش/.test(norm(q)) || (/ناقصني/.test(norm(q)) && !/عندي|معايا|عندنا/.test(norm(q)));
  if (!r) {
    const stop = new Set(["ايه", "ما", "هي", "هى", "ممكن", "عايز", "عايزه", "محتاج", "عاوز", "مكونات", "مقادير", "مكون", "طريقه", "خطوات", "وصفه", "الوصفه", "ازاي", "كيف", "اعمل", "اعرف", "في", "من", "عن", "علي", "بتاعه", "بتاع", "لو", "سمحت", "سمحتي"]);
    const query = norm(q).split(" ").filter(word => word && !stop.has(word)).join(" ");
    const candidates = query.length >= 2 ? searchRecipes(query, catalog).slice(0, 6) : [];
    return { text: candidates.length ? "لقيت وصفات ممكن تكون تقصدها. اختار الوصفة عشان أجاوبك من بياناتها، أو اختار من القائمة فوق." : "اختار الوصفة من القائمة فوق أو اكتب اسمها عشان أقدر أجاوبك. لو عايز تقارن الناقص، اكتب بعدها «عندي» والمكونات الموجودة.", ...(candidates.length ? { recipeSlugs: candidates.map(x => x.slug) } : {}) };
  }
  const base = { recipeSlug: r.slug };
  if (wantsSub) {
    if (!r.detail) return { ...base, text: "الوصفة دي ترشيح فيديو ومكوناتها الكاملة غير مكتوبة؛ راجع المصدر الأصلي، ومش هافترض مكوّن أو بديل لها." };
    const item = matchingItem(q, r);
    if (!item) return { ...base, text: `قولّي اسم المكوّن الناقص كما هو مكتوب في «${r.title}»، مثل: «بديل الحليب». افتح الوصفة لمراجعة القائمة.` };
    const sub = substituteFor(item.name);
    if (!sub) return { ...base, text: `مش لاقي بديل محرّر للمكوّن «${item.name}» في بيانات الموقع. راجع الوصفة والمصدر، ومش هاقترح بديل من عندي.` };
    return { ...base, text: `لـ «${item.name}»: ${sub.alt}. ${sub.note}.\n\n${SUBSTITUTE_DISCLAIMER} مش ضمان لنجاح البديل في الوصفة دي؛ راجع استخدامه والمصدر، ولا تستخدمه لاتخاذ قرار متعلق بالحساسية.` };
  }
  if (wantsMissing) return { ...base, text: missingReply(q, r) };
  if (/خطوه|خطوات|طريقه|ازاي|كيف|اطبخ|تتحضر|تحضير/.test(norm(q))) {
    return { ...base, text: r.detail ? `خطوات «${r.title}» المكتوبة:\n${r.detail.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join("\n\n")}\n\nراجع صفحة الوصفة والفيديو الأصلي للتفاصيل.` : "الخطوات التفصيلية للوصفة دي مش مكتوبة عندنا لسه؛ راجع الفيديو الأصلي من صفحة الوصفة." };
  }
  if (/مكونات|مقادير|مكون|مقدار|كمية|كميه/.test(norm(q))) {
    return { ...base, text: r.detail ? `المقادير المكتوبة لـ «${r.title}»:\n\n${listedIngredients(r)}\n\nراجع صفحة الوصفة والفيديو الأصلي.` : `الوصفة دي ترشيح فيديو. المكونات الظاهرة فقط: ${r.mainIngredients.join("، ") || "غير محددة"}. دي مش قائمة كاملة، والمقادير والتفاصيل في الفيديو الأصلي.` };
  }
  if (/وقت|مده|دقيقه|ساعه|تستغرق/.test(norm(q))) return { ...base, text: r.totalMinutes ? `الوقت الكلي الموثق لـ «${r.title}»: ${r.totalMinutes} دقيقة. راجع صفحة الوصفة للمصدر.` : "الوقت الكلي للوصفة مش موثق عندنا؛ مدة الفيديو مش مدة الطبخ. راجع المصدر الأصلي." };
  if (/مين|شيف|صاحب|مصدر|فيديو/.test(norm(q))) return { ...base, text: `هتلاقي اسم صاحب الوصفة ورابط الفيديو الأصلي في صفحة «${r.title}».` };
  return { ...base, text: `أنا معاك في «${r.title}». اسألني عن المقادير أو الخطوات أو الوقت، أو اكتب «عندي دجاج وبصل» عشان أقارن المكتوب. وللبديل اكتب اسم المكوّن الناقص.` };
}
