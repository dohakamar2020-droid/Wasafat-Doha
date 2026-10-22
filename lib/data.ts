// وصفات قمر — البيانات الأولية: 80 فيديو وشورت (22 أكتوبر 2024 → 22 أكتوبر 2026)
// نموذج البيانات يفصل بين "الوصفة" Recipe و"مصدر الفيديو" VideoSource كما هو مخطط في وثيقة المشروع:
// ثلاث وصفات لها شرح كامل وشورت منفصل، فعدد الوصفات 77 وعدد المصادر 80.
// ملحوظة تحريرية: المقادير والخطوات التفصيلية لم تُراجع بعد لكل وصفة، لذلك تظهر كلها بحالة
// "ترشيح فيديو" ولا نعرض أوقات طبخ أو مقادير مُخترعة — الأرقام هنا هي مشاهدات يوتيوب وقت المراجعة.

export type Creator = { id: string; name: string; tagline: string; style: string; channelHint: string };
export type VideoSource = { ytId: string; kind: "video" | "short"; published: string; views: number; sourceNo: number };
import { REVIEWED, type ReviewedDetail } from "./reviewed";
export type { ReviewedDetail };
export type Recipe = {
  slug: string; title: string; creatorId: string; category: string;
  mainIngredients: string[]; textures: string[]; needs: string[];
  why: string; sources: VideoSource[]; views: number; editorsPick?: boolean;
  status?: "reviewed" | "video"; // reviewed = وصفة مكتملة بعد مراجعة المقادير والخطوات | video = ترشيح فيديو
  detail?: ReviewedDetail;
};

export const SITE_NAME = "وصفات قمر";
export const SITE_TAGLINE = "وصفات تستاهل التجربة";

export const creators: Creator[] = [
  { id: "nadia", name: "نادية السيد", tagline: "أكلات بيتية وحلويات باردة تنقذ أي موقف", style: "شرح هادي ومقادير بيتية، وقوة خاصة في الحلويات الباردة وأكلات البطاطس", channelHint: "youtube.com — قناة نادية السيد" },
  { id: "heba", name: "هبة أبو الخير", tagline: "مخبوزات وحلويات بشكل يفرّح وتحضير واضح", style: "مخبوزات وعجائن وحلويات مناسبات، مع نسخ قصيرة وكاملة لبعض الوصفات", channelHint: "youtube.com — قناة هبة أبو الخير" },
  { id: "abeer", name: "عبير الصغير", tagline: "شورتس سريعة بأفكار تقديم مبهرة وانتشار ضخم", style: "أفكار بصرية سريعة: لفائف، صواني، وحلويات صيفية — الأعلى مشاهدة في المكتبة", channelHint: "youtube.com — قناة عبير الصغير" },
  { id: "omar", name: "شيف عمر", tagline: "أسرار الشام والمطاعم بالتفصيل", style: "شرح مفصّل للوصفات الشامية وأسرار المطاعم من الكبة للتومية", channelHint: "youtube.com — قناة شيف عمر" },
  { id: "abujulia", name: "أبو جوليا", tagline: "أكلات شامية وفلسطينية بروح بيتية", style: "وصفات بيتية بسيطة ومشروبات وأطباق من المطبخ الشامي", channelHint: "youtube.com — قناة أبو جوليا" },
];
export const creatorById = (id: string) => creators.find((c) => c.id === id)!;

export const recipes: Recipe[] = [
 {
  "slug": "three-potatoes",
  "title": "٣ بطاطسات أحلى من الحواوشي والفطير",
  "creatorId": "nadia",
  "category": "سناكس ومقبلات",
  "mainIngredients": [
   "بطاطس"
  ],
  "textures": [
   "مقرمش",
   "دافئ ومشبع"
  ],
  "needs": [
   "مكونات قليلة"
  ],
  "why": "٣ بطاطسات بس وتطلع حاجة أحلى من الحواوشي والفطير — اقتصادية وفكرتها ذكية.",
  "sources": [
   {
    "ytId": "CNoQH6sQa98",
    "kind": "short",
    "published": "06/2026",
    "views": 5250000,
    "sourceNo": 1
   }
  ],
  "views": 5250000,
  "editorsPick": true
 },
 {
  "slug": "mashed-potato-dinner",
  "title": "أكلة بالبطاطس للغداء أو العشاء — بطاطس مهروسة بإضافات",
  "creatorId": "nadia",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "بطاطس"
  ],
  "textures": [
   "كريمي",
   "دافئ ومشبع"
  ],
  "needs": [],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "LyVhR8oLfA8",
    "kind": "video",
    "published": "01/2025",
    "views": 2040000,
    "sourceNo": 2
   }
  ],
  "views": 2040000
 },
 {
  "slug": "alexandria-liver",
  "title": "سر الكبدة الإسكندراني بالطريقة الأصلية",
  "creatorId": "nadia",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "كبدة"
  ],
  "textures": [
   "متبّل",
   "دافئ ومشبع"
  ],
  "needs": [
   "طاسة واحدة"
  ],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "WonyIQYiOPY",
    "kind": "video",
    "published": "06/2025",
    "views": 1750000,
    "sourceNo": 3
   }
  ],
  "views": 1750000
 },
 {
  "slug": "lunchbox-sandwiches",
  "title": "أفكار ساندويتشات لانش بوكس جديدة ومبتكرة",
  "creatorId": "nadia",
  "category": "عشاء وسندوتشات",
  "mainIngredients": [
   "سندوتشات"
  ],
  "textures": [],
  "needs": [
   "لانش بوكس",
   "تحضير مسبق"
  ],
  "why": "اختيار عشاء عملي بفكرة لفّ أو تقديم مختلفة عن المعتاد.",
  "sources": [
   {
    "ytId": "DVw2PQK2TDY",
    "kind": "short",
    "published": "09/2026",
    "views": 1560000,
    "sourceNo": 4
   }
  ],
  "views": 1560000
 },
 {
  "slug": "qudrat-qadir-chocoflan",
  "title": "كيكة الكريم كراميل «قدرة قادر» — Chocoflan",
  "creatorId": "nadia",
  "category": "كيك ومخبوزات",
  "mainIngredients": [
   "حليب",
   "شوكولاتة"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [],
  "why": "مخبوزات بيتية بشكل يفرّح، مناسبة للتقديم مع الشاي والقهوة.",
  "sources": [
   {
    "ytId": "Z49OuVdqJnI",
    "kind": "video",
    "published": "05/2025",
    "views": 1450000,
    "sourceNo": 5
   }
  ],
  "views": 1450000
 },
 {
  "slug": "pan-gateau-chateau",
  "title": "جاتوه شاتوه الطاسة",
  "creatorId": "nadia",
  "category": "كيك ومخبوزات",
  "mainIngredients": [
   "شوكولاتة"
  ],
  "textures": [
   "شوكولاتة"
  ],
  "needs": [
   "طاسة واحدة"
  ],
  "why": "مخبوزات بيتية بشكل يفرّح، مناسبة للتقديم مع الشاي والقهوة.",
  "sources": [
   {
    "ytId": "EmjFu7VkqJ4",
    "kind": "short",
    "published": "08/2026",
    "views": 1410000,
    "sourceNo": 6
   }
  ],
  "views": 1410000,
  "editorsPick": true
 },
 {
  "slug": "cold-milk-dessert",
  "title": "تحلية حليب باردة بدون فرن أو بيض أو كريم كراميل",
  "creatorId": "nadia",
  "category": "حلويات باردة",
  "mainIngredients": [
   "حليب"
  ],
  "textures": [
   "كريمي",
   "منعش"
  ],
  "needs": [
   "بدون فرن",
   "تحضير مسبق"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "JLxE66MBV0U",
    "kind": "short",
    "published": "06/2026",
    "views": 1260000,
    "sourceNo": 7
   }
  ],
  "views": 1260000
 },
 {
  "slug": "milk-coffee-dessert",
  "title": "تحلية الحليب والقهوة بدون بيض أو فرن أو نشا",
  "creatorId": "nadia",
  "category": "حلويات باردة",
  "mainIngredients": [
   "حليب",
   "قهوة"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [
   "بدون فرن",
   "تحضير مسبق"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "h_D3MGkpBWY",
    "kind": "short",
    "published": "05/2026",
    "views": 1260000,
    "sourceNo": 8
   }
  ],
  "views": 1260000
 },
 {
  "slug": "vermicelli-starch-dessert",
  "title": "تحلية الشعيرية والنشا بدون فرن",
  "creatorId": "nadia",
  "category": "حلويات باردة",
  "mainIngredients": [
   "شعيرية",
   "حليب"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [
   "بدون فرن"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "nYRdna3cK0s",
    "kind": "short",
    "published": "05/2026",
    "views": 1240000,
    "sourceNo": 9
   },
   {
    "ytId": "PcPf7c_2cD8",
    "kind": "video",
    "published": "08/2025",
    "views": 734000,
    "sourceNo": 17
   }
  ],
  "views": 1974000
 },
 {
  "slug": "stuffed-onion",
  "title": "محشي البصل بطريقتها",
  "creatorId": "nadia",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "بصل",
   "أرز"
  ],
  "textures": [
   "دافئ ومشبع"
  ],
  "needs": [
   "مناسبة للعزومات"
  ],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "_kc1F-L_Dis",
    "kind": "video",
    "published": "08/2025",
    "views": 1120000,
    "sourceNo": 10
   }
  ],
  "views": 1120000
 },
 {
  "slug": "mango-ice-cream",
  "title": "آيس كريم مانجا كريمي بـ3 مكونات",
  "creatorId": "nadia",
  "category": "حلويات باردة",
  "mainIngredients": [
   "مانجا"
  ],
  "textures": [
   "كريمي",
   "منعش"
  ],
  "needs": [
   "مكونات قليلة",
   "بدون فرن"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "mPDjGZiYhwg",
    "kind": "short",
    "published": "07/2026",
    "views": 1010000,
    "sourceNo": 11
   },
   {
    "ytId": "fUZiTIUHdzk",
    "kind": "video",
    "published": "06/2025",
    "views": 565000,
    "sourceNo": 22
   }
  ],
  "views": 1575000
 },
 {
  "slug": "elham-kabsa",
  "title": "كبسة إلهام الشهيرة — ترند التيك توك",
  "creatorId": "nadia",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "أرز",
   "دجاج"
  ],
  "textures": [
   "متبّل",
   "دافئ ومشبع"
  ],
  "needs": [],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "7s5cS1ZBGDY",
    "kind": "video",
    "published": "06/2025",
    "views": 959000,
    "sourceNo": 12
   }
  ],
  "views": 959000
 },
 {
  "slug": "summer-flour-water",
  "title": "وصفة المصايف السريعة بالدقيق والماء بدون عجن",
  "creatorId": "nadia",
  "category": "سناكس ومقبلات",
  "mainIngredients": [
   "دقيق"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [
   "مكونات قليلة",
   "وقت قليل"
  ],
  "why": "فكرة مقرمشة تنفع سناك أو مقبلات على السفرة، وسريعة الالتقاط من المكتبة.",
  "sources": [
   {
    "ytId": "7352Vtltsrk",
    "kind": "short",
    "published": "08/2026",
    "views": 862000,
    "sourceNo": 13
   }
  ],
  "views": 862000
 },
 {
  "slug": "french-chamois-cake",
  "title": "كيكة الشمواه الفرنسية",
  "creatorId": "nadia",
  "category": "حلويات باردة",
  "mainIngredients": [
   "بسكويت",
   "حليب"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [
   "تحضير مسبق"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "ikD67x76aU8",
    "kind": "short",
    "published": "08/2026",
    "views": 833000,
    "sourceNo": 14
   }
  ],
  "views": 833000
 },
 {
  "slug": "chicken-kozamia",
  "title": "تشيكن كوزاميا — وجبة عائلية سريعة",
  "creatorId": "nadia",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "دجاج"
  ],
  "textures": [
   "كريمي",
   "سايح بالجبنة"
  ],
  "needs": [
   "وقت قليل"
  ],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "PoVzskZOWYw",
    "kind": "video",
    "published": "07/2025",
    "views": 804000,
    "sourceNo": 15
   }
  ],
  "views": 804000
 },
 {
  "slug": "italian-tiramisu-nadia",
  "title": "التيراميسو الإيطالي بطريقة البيوت الإيطالية",
  "creatorId": "nadia",
  "category": "حلويات باردة",
  "mainIngredients": [
   "قهوة",
   "بسكويت"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [
   "بدون فرن",
   "تحضير مسبق"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "acWVObi3I2o",
    "kind": "video",
    "published": "07/2025",
    "views": 803000,
    "sourceNo": 16
   }
  ],
  "views": 803000
 },
 {
  "slug": "cold-coffee-cups",
  "title": "أكواب القهوة الباردة بمكونات بسيطة",
  "creatorId": "nadia",
  "category": "مشروبات",
  "mainIngredients": [
   "قهوة",
   "حليب"
  ],
  "textures": [
   "كريمي",
   "منعش"
  ],
  "needs": [
   "مكونات قليلة",
   "بدون فرن"
  ],
  "why": "مشروب منعش يكمّل السفرة ويتجهز من غير فرن.",
  "sources": [
   {
    "ytId": "U5J6gQEGoz8",
    "kind": "video",
    "published": "08/2025",
    "views": 727000,
    "sourceNo": 18
   }
  ],
  "views": 727000
 },
 {
  "slug": "caramelized-onion-chicken-rice",
  "title": "دجاج مشوي بالبصل المكرمل مع أرز المطاعم المبهر",
  "creatorId": "nadia",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "دجاج",
   "بصل",
   "أرز"
  ],
  "textures": [
   "متبّل",
   "دافئ ومشبع"
  ],
  "needs": [
   "مناسبة للعزومات"
  ],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "NK8uiXsgpAs",
    "kind": "video",
    "published": "01/2026",
    "views": 719000,
    "sourceNo": 19
   }
  ],
  "views": 719000
 },
 {
  "slug": "date-dessert-4-ingredients",
  "title": "حلا التمر بأربعة مكونات",
  "creatorId": "nadia",
  "category": "حلويات باردة",
  "mainIngredients": [
   "تمر"
  ],
  "textures": [
   "دافئ ومشبع"
  ],
  "needs": [
   "مكونات قليلة"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "d93M5HbXZeI",
    "kind": "video",
    "published": "03/2025",
    "views": 704000,
    "sourceNo": 20
   }
  ],
  "views": 704000
 },
 {
  "slug": "pink-sauce-pasta",
  "title": "مكرونة بينك صوص في خطوة واحدة",
  "creatorId": "nadia",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "مكرونة"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [
   "وقت قليل",
   "طاسة واحدة"
  ],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "uQt_jsse4Wg",
    "kind": "video",
    "published": "08/2025",
    "views": 630000,
    "sourceNo": 21
   }
  ],
  "views": 630000
 },
 {
  "slug": "milk-flour-dessert",
  "title": "تحلية الحليب والدقيق بدون نشا أو فرن أو بيض أو كريمة",
  "creatorId": "nadia",
  "category": "حلويات باردة",
  "mainIngredients": [
   "حليب",
   "دقيق"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [
   "بدون فرن",
   "مكونات قليلة"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "2BFdr9U1F4E",
    "kind": "video",
    "published": "08/2025",
    "views": 527000,
    "sourceNo": 23
   }
  ],
  "views": 527000
 },
 {
  "slug": "goulash-meat-rolls",
  "title": "رولات الجلاش باللحمة المفرومة للعزومات",
  "creatorId": "heba",
  "category": "سناكس ومقبلات",
  "mainIngredients": [
   "جلاش",
   "لحمة مفرومة"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [
   "مناسبة للعزومات"
  ],
  "why": "رولات مقرمشة للعزومات، من أقوى شورتس هبة أبو الخير.",
  "sources": [
   {
    "ytId": "XCLKpNRBWL0",
    "kind": "short",
    "published": "02/2026",
    "views": 2940000,
    "sourceNo": 24
   }
  ],
  "views": 2940000,
  "editorsPick": true
 },
 {
  "slug": "cold-desserts-no-oven-heba",
  "title": "حلويات باردة تنقذك في آخر لحظة — بدون فرن",
  "creatorId": "heba",
  "category": "حلويات باردة",
  "mainIngredients": [
   "حليب",
   "بسكويت"
  ],
  "textures": [
   "كريمي",
   "منعش"
  ],
  "needs": [
   "بدون فرن",
   "وقت قليل"
  ],
  "why": "أكثر من حلو بارد في فيديو واحد، ينقذك لما الضيوف يقربوا.",
  "sources": [
   {
    "ytId": "WwuqOHqDFUM",
    "kind": "video",
    "published": "03/2025",
    "views": 2690000,
    "sourceNo": 25
   }
  ],
  "views": 2690000,
  "editorsPick": true
 },
 {
  "slug": "baked-donuts",
  "title": "الدونات المخبوزة — Baked Donut",
  "creatorId": "heba",
  "category": "كيك ومخبوزات",
  "mainIngredients": [
   "دقيق"
  ],
  "textures": [
   "إسفنجي"
  ],
  "needs": [],
  "why": "مخبوزات بيتية بشكل يفرّح، مناسبة للتقديم مع الشاي والقهوة.",
  "sources": [
   {
    "ytId": "oh4H0ZAwtVY",
    "kind": "short",
    "published": "10/2025",
    "views": 1400000,
    "sourceNo": 26
   }
  ],
  "views": 1400000
 },
 {
  "slug": "cinnamon-beehive",
  "title": "خلية النحل بالقرفة «خلية السينابون»",
  "creatorId": "heba",
  "category": "كيك ومخبوزات",
  "mainIngredients": [
   "دقيق",
   "قرفة"
  ],
  "textures": [
   "إسفنجي",
   "دافئ ومشبع"
  ],
  "needs": [],
  "why": "شكلها يفرّح وتتقدم مع القهوة — من مخبوزات هبة المميزة.",
  "sources": [
   {
    "ytId": "p7oZlofFNf0",
    "kind": "video",
    "published": "12/2024",
    "views": 1280000,
    "sourceNo": 27
   }
  ],
  "views": 1280000,
  "editorsPick": true
 },
 {
  "slug": "cold-dessert-5-min",
  "title": "حلى بارد جاهز في خمس دقائق",
  "creatorId": "heba",
  "category": "حلويات باردة",
  "mainIngredients": [
   "حليب"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [
   "بدون فرن",
   "وقت قليل"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "I-PYvk2cLSM",
    "kind": "short",
    "published": "05/2025",
    "views": 1160000,
    "sourceNo": 28
   }
  ],
  "views": 1160000
 },
 {
  "slug": "kunafa-cream",
  "title": "الكنافة بالقشطة بتاعة زمان — الشرح الكامل",
  "creatorId": "heba",
  "category": "حلويات باردة",
  "mainIngredients": [
   "كنافة",
   "قشطة"
  ],
  "textures": [
   "كريمي",
   "مقرمش"
  ],
  "needs": [
   "مناسبة للعزومات"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "6hOJ2vb1EeY",
    "kind": "video",
    "published": "02/2025",
    "views": 991000,
    "sourceNo": 29
   },
   {
    "ytId": "8CCmzhwsjk8",
    "kind": "short",
    "published": "02/2026",
    "views": 824000,
    "sourceNo": 33
   }
  ],
  "views": 1815000
 },
 {
  "slug": "pan-kofta-10-min",
  "title": "كفتة الطاسة في عشر دقائق",
  "creatorId": "heba",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "لحمة مفرومة"
  ],
  "textures": [
   "دافئ ومشبع"
  ],
  "needs": [
   "طاسة واحدة",
   "وقت قليل"
  ],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "LegGeaxPh68",
    "kind": "short",
    "published": "04/2025",
    "views": 986000,
    "sourceNo": 30
   }
  ],
  "views": 986000
 },
 {
  "slug": "potato-chicken-tray",
  "title": "صينية بطاطس بالدجاج بخلطة مختلفة",
  "creatorId": "heba",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "بطاطس",
   "دجاج"
  ],
  "textures": [
   "دافئ ومشبع"
  ],
  "needs": [],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "MSFYtG2lqu4",
    "kind": "short",
    "published": "03/2025",
    "views": 872000,
    "sourceNo": 31
   }
  ],
  "views": 872000
 },
 {
  "slug": "chicken-negrisco",
  "title": "نجرسكو الدجاج الكريمي بدون تعقيد",
  "creatorId": "heba",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "مكرونة",
   "دجاج"
  ],
  "textures": [
   "كريمي",
   "سايح بالجبنة"
  ],
  "needs": [],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "NvUt949eLq0",
    "kind": "video",
    "published": "11/2024",
    "views": 839000,
    "sourceNo": 32
   }
  ],
  "views": 839000
 },
 {
  "slug": "potato-minced-meat-tray",
  "title": "صينية بطاطس باللحمة المفرومة",
  "creatorId": "heba",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "بطاطس",
   "لحمة مفرومة"
  ],
  "textures": [
   "دافئ ومشبع"
  ],
  "needs": [],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "OTLkNdl7U1g",
    "kind": "short",
    "published": "04/2025",
    "views": 799000,
    "sourceNo": 34
   }
  ],
  "views": 799000
 },
 {
  "slug": "tiramisu-heba",
  "title": "التيراميسو",
  "creatorId": "heba",
  "category": "حلويات باردة",
  "mainIngredients": [
   "قهوة",
   "بسكويت"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [
   "بدون فرن",
   "تحضير مسبق"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "_lWyoJp-gNU",
    "kind": "short",
    "published": "05/2025",
    "views": 793000,
    "sourceNo": 35
   }
  ],
  "views": 793000
 },
 {
  "slug": "goulash-from-freezer",
  "title": "وصفة بلفة جلاش من الفريزر",
  "creatorId": "heba",
  "category": "سناكس ومقبلات",
  "mainIngredients": [
   "جلاش"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [
   "تحضير مسبق"
  ],
  "why": "فكرة مقرمشة تنفع سناك أو مقبلات على السفرة، وسريعة الالتقاط من المكتبة.",
  "sources": [
   {
    "ytId": "6GJayMgYpgY",
    "kind": "video",
    "published": "03/2025",
    "views": 736000,
    "sourceNo": 36
   }
  ],
  "views": 736000
 },
 {
  "slug": "chicken-shawarma",
  "title": "شاورما الدجاج",
  "creatorId": "heba",
  "category": "عشاء وسندوتشات",
  "mainIngredients": [
   "دجاج"
  ],
  "textures": [
   "متبّل"
  ],
  "needs": [],
  "why": "اختيار عشاء عملي بفكرة لفّ أو تقديم مختلفة عن المعتاد.",
  "sources": [
   {
    "ytId": "odXp6Jj_-PI",
    "kind": "short",
    "published": "09/2025",
    "views": 730000,
    "sourceNo": 37
   }
  ],
  "views": 730000
 },
 {
  "slug": "coffee-cake-one-cup",
  "title": "كيكة القهوة الهشة بكوب دقيق واحد",
  "creatorId": "heba",
  "category": "كيك ومخبوزات",
  "mainIngredients": [
   "قهوة",
   "دقيق"
  ],
  "textures": [
   "إسفنجي"
  ],
  "needs": [
   "مكونات قليلة"
  ],
  "why": "مخبوزات بيتية بشكل يفرّح، مناسبة للتقديم مع الشاي والقهوة.",
  "sources": [
   {
    "ytId": "VAQ9RhKn2y0",
    "kind": "video",
    "published": "12/2025",
    "views": 696000,
    "sourceNo": 38
   }
  ],
  "views": 696000
 },
 {
  "slug": "petit-four",
  "title": "البيتيفور الهش — أسرار نجاحه",
  "creatorId": "heba",
  "category": "كيك ومخبوزات",
  "mainIngredients": [
   "دقيق"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [],
  "why": "مخبوزات بيتية بشكل يفرّح، مناسبة للتقديم مع الشاي والقهوة.",
  "sources": [
   {
    "ytId": "UObz8L9PETk",
    "kind": "video",
    "published": "03/2025",
    "views": 672000,
    "sourceNo": 39
   }
  ],
  "views": 672000
 },
 {
  "slug": "eid-biscuits",
  "title": "بسكويت العيد على أصوله",
  "creatorId": "heba",
  "category": "كيك ومخبوزات",
  "mainIngredients": [
   "دقيق"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [],
  "why": "مخبوزات بيتية بشكل يفرّح، مناسبة للتقديم مع الشاي والقهوة.",
  "sources": [
   {
    "ytId": "Ka_roHq2F_A",
    "kind": "video",
    "published": "03/2025",
    "views": 618000,
    "sourceNo": 40
   }
  ],
  "views": 618000
 },
 {
  "slug": "molto-chocolate-cheese",
  "title": "مولتو بالشوكولاتة والجبنة بعجينة طرية",
  "creatorId": "heba",
  "category": "كيك ومخبوزات",
  "mainIngredients": [
   "شوكولاتة",
   "جبنة"
  ],
  "textures": [
   "شوكولاتة",
   "سايح بالجبنة"
  ],
  "needs": [],
  "why": "مخبوزات بيتية بشكل يفرّح، مناسبة للتقديم مع الشاي والقهوة.",
  "sources": [
   {
    "ytId": "FfEeTXs2wM0",
    "kind": "video",
    "published": "01/2025",
    "views": 598000,
    "sourceNo": 41
   }
  ],
  "views": 598000
 },
 {
  "slug": "three-samosa-fillings",
  "title": "ثلاث حشوات سمبوسة",
  "creatorId": "heba",
  "category": "سناكس ومقبلات",
  "mainIngredients": [
   "سمبوسة"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [
   "تحضير مسبق"
  ],
  "why": "فكرة مقرمشة تنفع سناك أو مقبلات على السفرة، وسريعة الالتقاط من المكتبة.",
  "sources": [
   {
    "ytId": "V1tqxHXy3n8",
    "kind": "short",
    "published": "02/2026",
    "views": 566000,
    "sourceNo": 42
   }
  ],
  "views": 566000
 },
 {
  "slug": "hali-altayebeen",
  "title": "حلى الطيبين",
  "creatorId": "heba",
  "category": "حلويات باردة",
  "mainIngredients": [
   "بسكويت",
   "حليب"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [
   "بدون فرن"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "OznM8H7Segs",
    "kind": "short",
    "published": "07/2025",
    "views": 541000,
    "sourceNo": 43
   }
  ],
  "views": 541000
 },
 {
  "slug": "budget-occasion-cake",
  "title": "تورتة مناسبات اقتصادية للمبتدئين",
  "creatorId": "heba",
  "category": "كيك ومخبوزات",
  "mainIngredients": [
   "دقيق"
  ],
  "textures": [
   "إسفنجي"
  ],
  "needs": [
   "مناسبة للعزومات",
   "أول تجربة في المطبخ"
  ],
  "why": "مخبوزات بيتية بشكل يفرّح، مناسبة للتقديم مع الشاي والقهوة.",
  "sources": [
   {
    "ytId": "7umLGIVIo7o",
    "kind": "video",
    "published": "12/2024",
    "views": 536000,
    "sourceNo": 44
   }
  ],
  "views": 536000
 },
 {
  "slug": "crispy-cauliflower",
  "title": "القرنبيط المقرمش بالخلطة السرية",
  "creatorId": "heba",
  "category": "سناكس ومقبلات",
  "mainIngredients": [
   "قرنبيط"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [],
  "why": "فكرة مقرمشة تنفع سناك أو مقبلات على السفرة، وسريعة الالتقاط من المكتبة.",
  "sources": [
   {
    "ytId": "nA_6YPeu64w",
    "kind": "video",
    "published": "12/2024",
    "views": 490000,
    "sourceNo": 45
   }
  ],
  "views": 490000
 },
 {
  "slug": "crispy-chicken-strips",
  "title": "ستربس الدجاج المقرمش",
  "creatorId": "heba",
  "category": "عشاء وسندوتشات",
  "mainIngredients": [
   "دجاج"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [],
  "why": "اختيار عشاء عملي بفكرة لفّ أو تقديم مختلفة عن المعتاد.",
  "sources": [
   {
    "ytId": "x0LiaQqV33w",
    "kind": "video",
    "published": "06/2025",
    "views": 434000,
    "sourceNo": 46
   }
  ],
  "views": 434000
 },
 {
  "slug": "mahshi-pot-secrets",
  "title": "حلة محشي وسر التسوية بدون ما يفك أو يعجن",
  "creatorId": "heba",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "محشي",
   "أرز"
  ],
  "textures": [
   "دافئ ومشبع"
  ],
  "needs": [
   "مناسبة للعزومات"
  ],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "lyJT2sZeuLw",
    "kind": "short",
    "published": "02/2026",
    "views": 1270000,
    "sourceNo": 47
   }
  ],
  "views": 1270000
 },
 {
  "slug": "potato-bechamel-tray",
  "title": "صينية البطاطس بالبشاميل على طريقة اللازانيا",
  "creatorId": "abeer",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "بطاطس",
   "بشاميل"
  ],
  "textures": [
   "كريمي",
   "سايح بالجبنة"
  ],
  "needs": [
   "مناسبة للعزومات"
  ],
  "why": "أوسع وصفة انتشارًا في المكتبة كلها — صينية شكلها يبهر على السفرة وفكرتها مستوحاة من اللازانيا.",
  "sources": [
   {
    "ytId": "HpHSkN-J6Ko",
    "kind": "short",
    "published": "07/2026",
    "views": 76200000,
    "sourceNo": 48
   }
  ],
  "views": 76200000,
  "editorsPick": true
 },
 {
  "slug": "raspberry-jam",
  "title": "مربى التوت — Raspberry Jam",
  "creatorId": "abeer",
  "category": "صوصات وإضافات",
  "mainIngredients": [
   "توت"
  ],
  "textures": [
   "منعش"
  ],
  "needs": [
   "تحضير مسبق"
  ],
  "why": "مربى توت بيتية تتشاف وتتحفظ، ومن أكثر شورتس عبير انتشارًا.",
  "sources": [
   {
    "ytId": "uVZY8mVSvpo",
    "kind": "short",
    "published": "08/2026",
    "views": 57700000,
    "sourceNo": 49
   }
  ],
  "views": 57700000,
  "editorsPick": true
 },
 {
  "slug": "steak-tortilla",
  "title": "تورتيلا الستيك",
  "creatorId": "abeer",
  "category": "عشاء وسندوتشات",
  "mainIngredients": [
   "تورتيلا",
   "لحمة"
  ],
  "textures": [
   "مقرمش",
   "متبّل"
  ],
  "needs": [],
  "why": "ستيك في تورتيلا: سندوتش سريع الشكل، فخم الطعم، ومن أقوى اختيارات العشاء.",
  "sources": [
   {
    "ytId": "Bgx3MfK0QPE",
    "kind": "short",
    "published": "04/2026",
    "views": 43700000,
    "sourceNo": 50
   }
  ],
  "views": 43700000,
  "editorsPick": true
 },
 {
  "slug": "shrimp-maqluba",
  "title": "مقلوبة الجمبري",
  "creatorId": "abeer",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "جمبري",
   "أرز"
  ],
  "textures": [
   "متبّل",
   "دافئ ومشبع"
  ],
  "needs": [
   "مناسبة للعزومات"
  ],
  "why": "مقلوبة بشكل مختلف بالجمبري — طبق رئيسي شكله عزومة.",
  "sources": [
   {
    "ytId": "sylsSUDEo8k",
    "kind": "short",
    "published": "05/2026",
    "views": 31200000,
    "sourceNo": 51
   }
  ],
  "views": 31200000,
  "editorsPick": true
 },
 {
  "slug": "stuffed-chicken-breast",
  "title": "صدور الدجاج المحشية",
  "creatorId": "abeer",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "دجاج"
  ],
  "textures": [
   "سايح بالجبنة"
  ],
  "needs": [
   "مناسبة للعزومات"
  ],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "7Q0ZgI1NOBY",
    "kind": "short",
    "published": "02/2026",
    "views": 24400000,
    "sourceNo": 52
   }
  ],
  "views": 24400000
 },
 {
  "slug": "potato-balloons",
  "title": "بالونات البطاطس — Potato Balloons",
  "creatorId": "abeer",
  "category": "سناكس ومقبلات",
  "mainIngredients": [
   "بطاطس"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [],
  "why": "فكرة بطاطس مختلفة تمامًا عن أي تقديم معتاد، وانتشارها الضخم سببه شكلها قبل طعمها.",
  "sources": [
   {
    "ytId": "WBsC7F3gt4k",
    "kind": "short",
    "published": "01/2026",
    "views": 20700000,
    "sourceNo": 53
   }
  ],
  "views": 20700000,
  "editorsPick": true
 },
 {
  "slug": "chicken-rice-oven",
  "title": "دجاج وأرز في الفرن",
  "creatorId": "abeer",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "دجاج",
   "أرز"
  ],
  "textures": [
   "دافئ ومشبع"
  ],
  "needs": [],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "mBzX37TQTlk",
    "kind": "short",
    "published": "04/2026",
    "views": 19100000,
    "sourceNo": 54
   }
  ],
  "views": 19100000
 },
 {
  "slug": "meat-tortilla-rolls",
  "title": "رولات تورتيلا باللحمة في الفرن",
  "creatorId": "abeer",
  "category": "عشاء وسندوتشات",
  "mainIngredients": [
   "تورتيلا",
   "لحمة"
  ],
  "textures": [
   "مقرمش",
   "سايح بالجبنة"
  ],
  "needs": [],
  "why": "اختيار عشاء عملي بفكرة لفّ أو تقديم مختلفة عن المعتاد.",
  "sources": [
   {
    "ytId": "_7b5gyEjcI0",
    "kind": "short",
    "published": "08/2026",
    "views": 17900000,
    "sourceNo": 55
   }
  ],
  "views": 17900000
 },
 {
  "slug": "banana-bread-bites",
  "title": "لقيمات خبز الموز — Banana Bread Bites",
  "creatorId": "abeer",
  "category": "حلويات باردة",
  "mainIngredients": [
   "موز"
  ],
  "textures": [
   "إسفنجي"
  ],
  "needs": [],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "cKYSiG2P7fU",
    "kind": "short",
    "published": "12/2025",
    "views": 15900000,
    "sourceNo": 56
   }
  ],
  "views": 15900000
 },
 {
  "slug": "grilled-chicken-wraps",
  "title": "لفائف الدجاج المشوية في الفرن",
  "creatorId": "abeer",
  "category": "عشاء وسندوتشات",
  "mainIngredients": [
   "دجاج",
   "تورتيلا"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [],
  "why": "اختيار عشاء عملي بفكرة لفّ أو تقديم مختلفة عن المعتاد.",
  "sources": [
   {
    "ytId": "8o_u9uMdoPg",
    "kind": "short",
    "published": "07/2026",
    "views": 15000000,
    "sourceNo": 57
   }
  ],
  "views": 15000000
 },
 {
  "slug": "strawberry-summer-desserts",
  "title": "ثلاث أفكار حلويات صيفية بالفراولة",
  "creatorId": "abeer",
  "category": "حلويات باردة",
  "mainIngredients": [
   "فراولة"
  ],
  "textures": [
   "منعش",
   "كريمي"
  ],
  "needs": [
   "بدون فرن"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "P44ee52Hpos",
    "kind": "short",
    "published": "07/2026",
    "views": 12300000,
    "sourceNo": 58
   }
  ],
  "views": 12300000
 },
 {
  "slug": "salmon-curry-rice",
  "title": "كاري السلمون مع الأرز",
  "creatorId": "abeer",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "سلمون",
   "أرز"
  ],
  "textures": [
   "كريمي",
   "متبّل"
  ],
  "needs": [],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "RXDfGfvshkU",
    "kind": "short",
    "published": "04/2026",
    "views": 11900000,
    "sourceNo": 59
   }
  ],
  "views": 11900000
 },
 {
  "slug": "pizza-tortilla-rolls",
  "title": "رولات بيتزا التورتيلا",
  "creatorId": "abeer",
  "category": "عشاء وسندوتشات",
  "mainIngredients": [
   "تورتيلا",
   "جبنة"
  ],
  "textures": [
   "سايح بالجبنة",
   "مقرمش"
  ],
  "needs": [],
  "why": "اختيار عشاء عملي بفكرة لفّ أو تقديم مختلفة عن المعتاد.",
  "sources": [
   {
    "ytId": "OlwQ7DhWvzM",
    "kind": "short",
    "published": "03/2026",
    "views": 11500000,
    "sourceNo": 60
   }
  ],
  "views": 11500000
 },
 {
  "slug": "mango-cheesecake",
  "title": "تشيز كيك المانجا",
  "creatorId": "abeer",
  "category": "حلويات باردة",
  "mainIngredients": [
   "مانجا"
  ],
  "textures": [
   "كريمي",
   "منعش"
  ],
  "needs": [
   "بدون فرن",
   "تحضير مسبق"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "Cyro3VoP1-A",
    "kind": "short",
    "published": "04/2026",
    "views": 11200000,
    "sourceNo": 61
   }
  ],
  "views": 11200000,
  "editorsPick": true
 },
 {
  "slug": "chocolate-truffles-2-ing",
  "title": "ترافلز الشوكولاتة بمكونين",
  "creatorId": "abeer",
  "category": "حلويات باردة",
  "mainIngredients": [
   "شوكولاتة"
  ],
  "textures": [
   "شوكولاتة"
  ],
  "needs": [
   "مكونات قليلة",
   "بدون فرن"
  ],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "CTeqe-mljnE",
    "kind": "short",
    "published": "04/2026",
    "views": 10900000,
    "sourceNo": 62
   }
  ],
  "views": 10900000,
  "editorsPick": true
 },
 {
  "slug": "creamy-garlic-shrimp-rice",
  "title": "جمبري بصوص الثوم الكريمي مع الأرز",
  "creatorId": "abeer",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "جمبري",
   "أرز"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "K9ZIFBR9Qlo",
    "kind": "short",
    "published": "08/2026",
    "views": 9550000,
    "sourceNo": 63
   }
  ],
  "views": 9550000
 },
 {
  "slug": "chicken-kebab-pan",
  "title": "كباب الدجاج في الطاسة",
  "creatorId": "abeer",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "دجاج"
  ],
  "textures": [
   "متبّل"
  ],
  "needs": [
   "طاسة واحدة"
  ],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "uPetybaVPGQ",
    "kind": "short",
    "published": "01/2026",
    "views": 9220000,
    "sourceNo": 64
   }
  ],
  "views": 9220000
 },
 {
  "slug": "chicken-kebab-rice",
  "title": "كباب الدجاج مع الأرز",
  "creatorId": "abeer",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "دجاج",
   "أرز"
  ],
  "textures": [
   "متبّل",
   "دافئ ومشبع"
  ],
  "needs": [],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "eHXAxEv_KAQ",
    "kind": "short",
    "published": "08/2026",
    "views": 9070000,
    "sourceNo": 65
   }
  ],
  "views": 9070000
 },
 {
  "slug": "fried-bites-2-ing",
  "title": "لقيمات مقلية بمكونين",
  "creatorId": "abeer",
  "category": "سناكس ومقبلات",
  "mainIngredients": [
   "دقيق"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [
   "مكونات قليلة"
  ],
  "why": "فكرة مقرمشة تنفع سناك أو مقبلات على السفرة، وسريعة الالتقاط من المكتبة.",
  "sources": [
   {
    "ytId": "w7HoSxdyCik",
    "kind": "short",
    "published": "01/2026",
    "views": 7270000,
    "sourceNo": 66
   }
  ],
  "views": 7270000
 },
 {
  "slug": "burger-wrap",
  "title": "برجر راب — Burger Wrap",
  "creatorId": "abeer",
  "category": "عشاء وسندوتشات",
  "mainIngredients": [
   "تورتيلا",
   "لحمة"
  ],
  "textures": [
   "سايح بالجبنة"
  ],
  "needs": [],
  "why": "اختيار عشاء عملي بفكرة لفّ أو تقديم مختلفة عن المعتاد.",
  "sources": [
   {
    "ytId": "2KCrUTHBrNM",
    "kind": "short",
    "published": "01/2026",
    "views": 7050000,
    "sourceNo": 67
   }
  ],
  "views": 7050000
 },
 {
  "slug": "milk-pudding-bites",
  "title": "لقيمات بودينج الحليب الترند",
  "creatorId": "abeer",
  "category": "حلويات باردة",
  "mainIngredients": [
   "حليب"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [],
  "why": "حلو بارد يتجهز على مهله وينفع قبل الضيوف — من الاختيارات المنتشرة عند صاحبته.",
  "sources": [
   {
    "ytId": "_tuedMCFojQ",
    "kind": "short",
    "published": "01/2026",
    "views": 6610000,
    "sourceNo": 68
   }
  ],
  "views": 6610000
 },
 {
  "slug": "toumeya-secrets",
  "title": "أسرار تومية المطاعم",
  "creatorId": "omar",
  "category": "صوصات وإضافات",
  "mainIngredients": [
   "ثوم"
  ],
  "textures": [
   "كريمي"
  ],
  "needs": [],
  "why": "التومية صوص يرفع أي سندوتش، وده الشرح المفصّل لأسرار المطاعم.",
  "sources": [
   {
    "ytId": "kqZKUnI18ss",
    "kind": "video",
    "published": "01/2026",
    "views": 872000,
    "sourceNo": 69
   }
  ],
  "views": 872000
 },
 {
  "slug": "kibbeh-bab-alhara",
  "title": "كبة باب الحارة — الكبة المقلية",
  "creatorId": "omar",
  "category": "سناكس ومقبلات",
  "mainIngredients": [
   "برغل",
   "لحمة"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [
   "مناسبة للعزومات"
  ],
  "why": "فكرة مقرمشة تنفع سناك أو مقبلات على السفرة، وسريعة الالتقاط من المكتبة.",
  "sources": [
   {
    "ytId": "hF6pkiHbr4s",
    "kind": "video",
    "published": "02/2026",
    "views": 477000,
    "sourceNo": 70
   }
  ],
  "views": 477000
 },
 {
  "slug": "syrian-grill-chicken",
  "title": "أسرار فروج الشواية السوري",
  "creatorId": "omar",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "دجاج"
  ],
  "textures": [
   "متبّل"
  ],
  "needs": [
   "مناسبة للعزومات"
  ],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "mf0urOq1Dm4",
    "kind": "video",
    "published": "12/2025",
    "views": 475000,
    "sourceNo": 71
   }
  ],
  "views": 475000
 },
 {
  "slug": "ramadan-sambousek",
  "title": "سمبوسك رمضان المقرمشة بالعجينة اليابانية",
  "creatorId": "omar",
  "category": "سناكس ومقبلات",
  "mainIngredients": [
   "سمبوسة"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [
   "تحضير مسبق"
  ],
  "why": "فكرة مقرمشة تنفع سناك أو مقبلات على السفرة، وسريعة الالتقاط من المكتبة.",
  "sources": [
   {
    "ytId": "A1US7Quaexc",
    "kind": "video",
    "published": "02/2026",
    "views": 437000,
    "sourceNo": 72
   }
  ],
  "views": 437000
 },
 {
  "slug": "healthy-eid-kahk",
  "title": "كعك العيد الصحي الاقتصادي بدون سكر",
  "creatorId": "omar",
  "category": "كيك ومخبوزات",
  "mainIngredients": [
   "دقيق"
  ],
  "textures": [],
  "needs": [
   "أول تجربة في المطبخ"
  ],
  "why": "مخبوزات بيتية بشكل يفرّح، مناسبة للتقديم مع الشاي والقهوة.",
  "sources": [
   {
    "ytId": "bIdtw7pGCSg",
    "kind": "video",
    "published": "03/2025",
    "views": 415000,
    "sourceNo": 73
   }
  ],
  "views": 415000
 },
 {
  "slug": "grilled-kibbeh",
  "title": "كل أسرار الكبة المشوية",
  "creatorId": "omar",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "برغل",
   "لحمة"
  ],
  "textures": [
   "متبّل"
  ],
  "needs": [
   "مناسبة للعزومات"
  ],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "_DYETsxyYSE",
    "kind": "video",
    "published": "02/2026",
    "views": 387000,
    "sourceNo": 74
   }
  ],
  "views": 387000
 },
 {
  "slug": "turkish-doner-kebab",
  "title": "كباب الدونر التركي — وصفة الترند",
  "creatorId": "omar",
  "category": "عشاء وسندوتشات",
  "mainIngredients": [
   "لحمة"
  ],
  "textures": [
   "متبّل"
  ],
  "needs": [],
  "why": "اختيار عشاء عملي بفكرة لفّ أو تقديم مختلفة عن المعتاد.",
  "sources": [
   {
    "ytId": "7lUQRDK3frU",
    "kind": "video",
    "published": "11/2025",
    "views": 347000,
    "sourceNo": 75
   }
  ],
  "views": 347000
 },
 {
  "slug": "chicken-burger-omar",
  "title": "برجر الدجاج",
  "creatorId": "omar",
  "category": "عشاء وسندوتشات",
  "mainIngredients": [
   "دجاج"
  ],
  "textures": [
   "مقرمش"
  ],
  "needs": [],
  "why": "اختيار عشاء عملي بفكرة لفّ أو تقديم مختلفة عن المعتاد.",
  "sources": [
   {
    "ytId": "YtPgLtjSNBo",
    "kind": "video",
    "published": "05/2025",
    "views": 326000,
    "sourceNo": 76
   }
  ],
  "views": 326000
 },
 {
  "slug": "hibiscus-juice",
  "title": "الطريقة المضبوطة لعصير الكركديه المنعش",
  "creatorId": "abujulia",
  "category": "مشروبات",
  "mainIngredients": [
   "عصير الكركديه"
  ],
  "textures": [
   "منعش"
  ],
  "needs": [
   "بدون فرن"
  ],
  "why": "مشروب منعش يكمّل السفرة ويتجهز من غير فرن.",
  "sources": [
   {
    "ytId": "OO8XxUElEmY",
    "kind": "video",
    "published": "05/2026",
    "views": 309000,
    "sourceNo": 77
   }
  ],
  "views": 309000
 },
 {
  "slug": "tomato-qallaya",
  "title": "قلاية البندورة",
  "creatorId": "abujulia",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "بندورة"
  ],
  "textures": [
   "متبّل"
  ],
  "needs": [
   "طاسة واحدة",
   "مكونات قليلة"
  ],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "Z0Tjw5HGxKk",
    "kind": "video",
    "published": "08/2026",
    "views": 286000,
    "sourceNo": 78
   }
  ],
  "views": 286000
 },
 {
  "slug": "stretch-minced-meat",
  "title": "زيادة كمية اللحمة وتحضير وصفات بها",
  "creatorId": "abujulia",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "لحمة"
  ],
  "textures": [],
  "needs": [],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "uzgoWkqnoFQ",
    "kind": "video",
    "published": "05/2025",
    "views": 255000,
    "sourceNo": 79
   }
  ],
  "views": 255000
 },
 {
  "slug": "chicken-orange-molasses-tray",
  "title": "صينية دجاج بدبس البرتقال",
  "creatorId": "abujulia",
  "category": "أطباق رئيسية",
  "mainIngredients": [
   "دجاج",
   "برتقال"
  ],
  "textures": [
   "دافئ ومشبع"
  ],
  "needs": [],
  "why": "طبق رئيسي منتشر عند صاحبه، اخترناه لتميز فكرته ووضوح نتيجته في الفيديو.",
  "sources": [
   {
    "ytId": "HnqbXjj45FQ",
    "kind": "video",
    "published": "07/2026",
    "views": 145000,
    "sourceNo": 80
   }
  ],
  "views": 145000
 }
];

// إرفاق تفاصيل المراجعة اليدوية: الوصفة بتبقى «مكتملة» بس لو ليها مقادير وخطوات مراجعة
for (const r of recipes as Recipe[]) {
  const d = REVIEWED[r.slug];
  r.status = d ? "reviewed" : "video";
  if (d) r.detail = d;
}
export const reviewedRecipes = (recipes as Recipe[]).filter((r) => r.status === "reviewed");
export const allSourcesCount = recipes.reduce((a, r) => a + r.sources.length, 0);
export const recipeBySlug = (slug: string) => recipes.find((r) => r.slug === slug);
export const ytThumb = (ytId: string) => `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
export const ytWatchUrl = (s: VideoSource) => s.kind === "short" ? `https://www.youtube.com/shorts/${s.ytId}` : `https://www.youtube.com/watch?v=${s.ytId}`;
export const ytEmbedUrl = (ytId: string) => `https://www.youtube-nocookie.com/embed/${ytId}?rel=0`;
export function formatViews(n: number): string {
  if (n >= 1_000_000) { const v = n / 1_000_000; return `${v >= 10 ? Math.round(v*10)/10 : Math.round(v*100)/100} مليون`; }
  if (n >= 1_000) return `${Math.round(n / 1000)} ألف`;
  return `${n}`;
}
export const categories = ["أطباق رئيسية","عشاء وسندوتشات","سناكس ومقبلات","حلويات باردة","كيك ومخبوزات","فطار","مشروبات","صوصات وإضافات"];
export const allTextures = ["مقرمش","كريمي","سايح بالجبنة","شوكولاتة","منعش","متبّل","حار","دافئ ومشبع","إسفنجي"];
export const allNeeds = ["وقت قليل","طاسة واحدة","بدون فرن","تحضير مسبق","مناسبة للعزومات","لانش بوكس","مكونات قليلة","أول تجربة في المطبخ"];
export const allIngredients = ["بطاطس","دجاج","لحمة مفرومة","لحمة","جمبري","مكرونة","جلاش","تورتيلا","حليب","قهوة","مانجا","بسكويت","شوكولاتة","دقيق","أرز","بصل","تمر","شعيرية","كنافة","سمبوسة","سلمون","فراولة","توت","موز","قرنبيط","كبدة","برغل"];

// قاموس مرادفات البحث العربي
const SYN: Record<string, string[]> = {
  "فراخ": ["دجاج"], "بطاطا": ["بطاطس"], "غلاش": ["جلاش"], "باشميل": ["بشاميل"],
  "نجرسكوا": ["نجرسكو"], "طحين": ["دقيق"], "رز": ["أرز"], "بندورة": ["طماطم","بندورة"],
  "مكرونه": ["مكرونة"], "مانجو": ["مانجا"], "تيراميسو": ["تيراميسو"], "شاورما": ["شاورما"],
};
export function normalizeAr(s: string): string {
  return s.toLowerCase().replace(/[ً-ٰٟ]/g, "").replace(/ـ/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").trim();
}
export function searchRecipes(q: string): Recipe[] {
  const nq = normalizeAr(q); if (!nq) return [];
  const terms = new Set<string>([nq]);
  for (const [k, vals] of Object.entries(SYN)) if (nq.includes(normalizeAr(k))) vals.forEach(v => terms.add(normalizeAr(v)));
  const scored = recipes.map(r => {
    const detailIngs = r.detail ? r.detail.ingredients.flatMap((g) => g.items.map((i) => i.name)) : [];
    const hay = [r.title, r.category, creatorById(r.creatorId).name, ...r.mainIngredients, ...r.textures, ...r.needs, ...detailIngs].map(normalizeAr).join(" ");
    let score = 0;
    terms.forEach(t => { if (normalizeAr(r.title).includes(t)) score += 5; else if (hay.includes(t)) score += 2; });
    nq.split(/\s+/).forEach(w => { if (w.length > 1 && hay.includes(w)) score += 1; });
    return { r, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || b.r.views - a.r.views);
  return scored.map(x => x.r);
}
// علاقات بين الوصفات بسبب واضح (قريب منها... بطعم مختلف)
export function relatedRecipes(r: Recipe): { recipe: Recipe; reason: string }[] {
  const out: { recipe: Recipe; reason: string }[] = [];
  const push = (c: Recipe | undefined, reason: string) => { if (c && c.slug !== r.slug && !out.find(x => x.recipe.slug === c.slug)) out.push({ recipe: c, reason }); };
  push(recipes.filter(x => x.slug !== r.slug && x.title.replace(/[^\u0600-\u06FF]/g,"").slice(0,6) === r.title.replace(/[^\u0600-\u06FF]/g,"").slice(0,6)).sort((a,b)=>b.views-a.views)[0], "نفس الطبق من شيف تاني — قارن بينهم");
  push(recipes.filter(x => x.slug !== r.slug && x.mainIngredients.some(i => r.mainIngredients.includes(i)) && x.category === r.category).sort((a,b)=>b.views-a.views)[0], `نفس المكوّن الأساسي (${r.mainIngredients[0]}) بشكل تاني`);
  push(recipes.filter(x => x.slug !== r.slug && x.mainIngredients.some(i => r.mainIngredients.includes(i)) && x.category !== r.category).sort((a,b)=>b.views-a.views)[0], "باقي المكوّنات تنفع هنا");
  push(recipes.filter(x => x.slug !== r.slug && x.textures.some(t => r.textures.includes(t))).sort((a,b)=>b.views-a.views)[0], "نفس القوام اللي عجبك");
  push(recipes.filter(x => ["صوصات وإضافات","مشروبات","سناكس ومقبلات"].includes(x.category)).sort((a,b)=>b.views-a.views)[0], "لو عايز تقدّم معاها حاجة");
  return out.slice(0, 4);
}

export type Collection = { slug: string; title: string; desc: string; recipeSlugs: string[] };
export const collections: Collection[] = [
 {
  "slug": "start-here",
  "title": "ابدأ من هنا — أقوى اللقطات",
  "desc": "أقوى 12 اختيار من المكتبة كلها، مرتبة بعناية عشان أول زيارة.",
  "recipeSlugs": [
   "potato-bechamel-tray",
   "three-potatoes",
   "goulash-meat-rolls",
   "cold-desserts-no-oven-heba",
   "steak-tortilla",
   "shrimp-maqluba",
   "potato-balloons",
   "pan-gateau-chateau",
   "mango-cheesecake",
   "chocolate-truffles-2-ing",
   "meat-tortilla-rolls",
   "cinnamon-beehive"
  ]
 },
 {
  "slug": "potato",
  "title": "البطاطس في حتة تانية",
  "desc": "سناك ووجبة وصينية — البطاطس بكل شخصياتها.",
  "recipeSlugs": [
   "potato-bechamel-tray",
   "potato-balloons",
   "three-potatoes",
   "mashed-potato-dinner",
   "potato-chicken-tray",
   "potato-minced-meat-tray"
  ]
 },
 {
  "slug": "fridge-desserts",
  "title": "حلويات التلاجة",
  "desc": "حلويات باردة من غير فرن، تتجهز قبل الضيوف.",
  "recipeSlugs": [
   "cold-desserts-no-oven-heba",
   "cold-milk-dessert",
   "milk-coffee-dessert",
   "cold-dessert-5-min",
   "italian-tiramisu-nadia",
   "mango-cheesecake",
   "hali-altayebeen",
   "french-chamois-cake",
   "chocolate-truffles-2-ing",
   "strawberry-summer-desserts"
  ]
 },
 {
  "slug": "one-pan",
  "title": "عشاء الطاسة الواحدة",
  "desc": "أكلات تتعمل في طاسة واحدة وتخلص بسرعة.",
  "recipeSlugs": [
   "pan-kofta-10-min",
   "alexandria-liver",
   "pan-gateau-chateau",
   "pink-sauce-pasta",
   "chicken-kebab-pan",
   "tomato-qallaya"
  ]
 },
 {
  "slug": "wraps",
  "title": "لفائف وسندوتشات غير معتادة",
  "desc": "تورتيلا وجلاش ولفائف بشكل مختلف.",
  "recipeSlugs": [
   "steak-tortilla",
   "meat-tortilla-rolls",
   "pizza-tortilla-rolls",
   "burger-wrap",
   "grilled-chicken-wraps",
   "goulash-meat-rolls",
   "chicken-shawarma",
   "lunchbox-sandwiches"
  ]
 },
 {
  "slug": "feast",
  "title": "أكلات شكلها عزومة",
  "desc": "أطباق رئيسية تنفع سفرة ضيوف.",
  "recipeSlugs": [
   "potato-bechamel-tray",
   "shrimp-maqluba",
   "stuffed-chicken-breast",
   "caramelized-onion-chicken-rice",
   "kunafa-cream",
   "mahshi-pot-secrets",
   "syrian-grill-chicken",
   "stuffed-onion"
  ]
 },
 {
  "slug": "no-oven",
  "title": "وصفات من غير فرن",
  "desc": "من غير ما تشغّل الفرن خالص.",
  "recipeSlugs": [
   "cold-desserts-no-oven-heba",
   "cold-milk-dessert",
   "vermicelli-starch-dessert",
   "italian-tiramisu-nadia",
   "tiramisu-heba",
   "mango-ice-cream",
   "chocolate-truffles-2-ing",
   "hibiscus-juice",
   "milk-flour-dessert"
  ]
 },
 {
  "slug": "shami-omar",
  "title": "شاميات شيف عمر",
  "desc": "كبة وتومية وفروج شواية — الشرح المفصّل.",
  "recipeSlugs": [
   "toumeya-secrets",
   "kibbeh-bab-alhara",
   "grilled-kibbeh",
   "syrian-grill-chicken",
   "ramadan-sambousek",
   "turkish-doner-kebab"
  ]
 },
 {
  "slug": "few-ingredients",
  "title": "مكونات قليلة، نتيجة كبيرة",
  "desc": "٣ مكونات، ٤ مكونات، أو حتى مكونين بس.",
  "recipeSlugs": [
   "mango-ice-cream",
   "chocolate-truffles-2-ing",
   "fried-bites-2-ing",
   "date-dessert-4-ingredients",
   "summer-flour-water",
   "coffee-cake-one-cup",
   "cold-coffee-cups"
  ]
 }
];
collections.push(
  { slug: "movie-night", title: "مزاج الليلة: قعدة فيلم", desc: "سندوتشات وسناكس وحلو سريع لقعدة أفلام.", recipeSlugs: ["burger-wrap", "pizza-tortilla-rolls", "potato-balloons", "chocolate-truffles-2-ing"] },
  { slug: "quiet-dinner", title: "مزاج الليلة: عشاء هادي", desc: "أطباق خفيفة التحضير ليوم هادي.", recipeSlugs: ["salmon-curry-rice", "tomato-qallaya", "hibiscus-juice", "creamy-garlic-shrimp-rice"] },
  { slug: "start-easy", title: "ابدأ بالسهل", desc: "مسار صغير من وصفات مكتملة المراجعة تناسب أول تجارب المطبخ.", recipeSlugs: ["pink-sauce-pasta", "cinnamon-beehive", "kunafa-cream", "elham-kabsa"] },
);
export const collectionBySlug = (s: string) => collections.find(c => c.slug === s);
