import type { Creator, Recipe } from "./data";

// اختيارات من قوائم المستخدم؛ أرقام المشاهدات لقطة ٦ نوفمبر ٢٠٢٦.
export const USER_CANDIDATE_CREATORS: Creator[] = [
  {
    "id": "huma-kitchen",
    "name": "Huma in the kitchen",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@Humainthekitchen"
  },
  {
    "id": "lovely-delites",
    "name": "Lovely Delites",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@lovelydelites"
  },
  {
    "id": "kelsey-nixon",
    "name": "Kelsey Nixon",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@kelseynixon"
  },
  {
    "id": "claire-tansey",
    "name": "Claire Tansey’s Kitchen",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@ClaireTanseysKitchen"
  },
  {
    "id": "ika-kitchen",
    "name": "The Ika Kitchen",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@Theikakitchen"
  },
  {
    "id": "tasty-channel",
    "name": "Tasty",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@buzzfeedtasty"
  },
  {
    "id": "ashley-treats",
    "name": "Ashley Markle Treats",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@ashleymarkletreats"
  },
  {
    "id": "faridas-kitchen",
    "name": "Faridas Kitchen",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@Faridas.Kitchen"
  },
  {
    "id": "hydrow",
    "name": "Hydrow",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@HydrowRower"
  },
  {
    "id": "ms-vegan",
    "name": "MsVegan",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@MsVegan"
  },
  {
    "id": "kingsford",
    "name": "Kingsford",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@Kingsford"
  },
  {
    "id": "dominidenn",
    "name": "Dominidenn",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@Dominidenn"
  },
  {
    "id": "food-breaker",
    "name": "Food Breaker",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@foodbreaker"
  },
  {
    "id": "golden-balance",
    "name": "The Golden Balance",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@thegoldenbalance"
  },
  {
    "id": "molly-thompson",
    "name": "Molly Thompson",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@whatmollymade"
  },
  {
    "id": "pastry-living",
    "name": "Pastry Living with Aya",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@PastryLivingwithAya"
  },
  {
    "id": "yum-recipes",
    "name": "Yum",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@Yumrecipes"
  },
  {
    "id": "jayas-cookbook",
    "name": "Jayas Cookbook",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@JayasCookbook"
  },
  {
    "id": "amanda-freitag",
    "name": "Chef Amanda Freitag",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@ChefAmandaFreitag"
  },
  {
    "id": "baking-cooking-fun",
    "name": "BakingCookingFun",
    "tagline": "وصفات وأفكار من المطبخ",
    "style": "وصفات مصوّرة من قناة يوتيوب",
    "channelHint": "youtube.com/@BakingCookingFun2"
  }
];

export const USER_CANDIDATES: Recipe[] = [
  {
    "slug": "dubai-qishta-huma",
    "title": "حلوى قشطة دبي بالعسل والفستق",
    "creatorId": "huma-kitchen",
    "category": "حلويات باردة",
    "mainIngredients": [
      "حليب",
      "قشطة",
      "فستق"
    ],
    "textures": [
      "كريمي"
    ],
    "needs": [],
    "why": "قشطة مخبوزة ومبرّدة بالعسل والفستق من قناة Huma؛ للوصفة الأصلية تفاصيل مختلفة بين الوصف والفيديو، فارجعي للفيديو.",
    "sources": [
      {
        "ytId": "zi1Fkievvug",
        "kind": "video",
        "published": "10/2026",
        "uploadedAt": "2026-10-16",
        "durationSec": 324,
        "views": 6785,
        "sourceNo": 137
      }
    ],
    "views": 6785,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "biscoff-yogurt-cheesecake",
    "title": "تشيز كيك الزبادي والبسكوف البارد",
    "creatorId": "lovely-delites",
    "category": "حلويات باردة",
    "mainIngredients": [
      "زبادي",
      "بسكويت"
    ],
    "textures": [
      "كريمي"
    ],
    "needs": [],
    "why": "زبادي يوناني وبسكوف يتبرّدوا ليلة؛ دي نسخة مستوحاة من الفكرة اللي في قائمتك وليست تشيز كيك مخبوز.",
    "sources": [
      {
        "ytId": "c9azlLEeDEE",
        "kind": "short",
        "published": "01/2026",
        "uploadedAt": "2026-01-19",
        "durationSec": 14,
        "views": 768190,
        "sourceNo": 138
      }
    ],
    "views": 768190,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "stuffed-sweet-potato-beans",
    "title": "بطاطا حلوة محشية بالفاصوليا وصوص الزبادي",
    "creatorId": "kelsey-nixon",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "بطاطا حلوة",
      "فاصوليا",
      "زبادي"
    ],
    "textures": [
      "دافئ ومشبع"
    ],
    "needs": [],
    "why": "نسخة بطاطا مشوية محشية بفاصوليا متبّلة وزبادي من قناة Kelsey Nixon، إحدى صيغ البطاطا المحشية.",
    "sources": [
      {
        "ytId": "D7z8enH6Vtc",
        "kind": "video",
        "published": "01/2021",
        "uploadedAt": "2021-01-19",
        "durationSec": 259,
        "views": 581,
        "sourceNo": 139
      }
    ],
    "views": 581,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "rotisserie-chicken-fried-rice",
    "title": "أرز مقلي ببواقي الدجاج المشوي",
    "creatorId": "claire-tansey",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "دجاج",
      "أرز",
      "بيض"
    ],
    "textures": [
      "دافئ ومشبع"
    ],
    "needs": [],
    "why": "أرز مطبوخ مسبقًا ودجاج مشوي مع خضار وبيض في طاسة؛ نسخة من فكرة استغلال بواقي الدجاج.",
    "sources": [
      {
        "ytId": "HZKG8BMk3aY",
        "kind": "video",
        "published": "09/2021",
        "uploadedAt": "2021-09-23",
        "durationSec": 625,
        "views": 18108,
        "sourceNo": 140
      }
    ],
    "views": 18108,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "sabudana-cheese-balls",
    "title": "كرات السابودانا بالجبنة",
    "creatorId": "ika-kitchen",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "سابودانا",
      "جبنة",
      "بطاطس"
    ],
    "textures": [
      "مقرمش"
    ],
    "needs": [],
    "why": "سناك هندي بالسابودانا والجبنة؛ ده فيديو بديل من قناة أخرى، مش الفيديو المؤجل في التقرير.",
    "sources": [
      {
        "ytId": "FHNHdAYRhG8",
        "kind": "video",
        "published": "04/2025",
        "uploadedAt": "2025-04-02",
        "durationSec": 370,
        "views": 2407,
        "sourceNo": 141
      }
    ],
    "views": 2407,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "shrimp-lemon-pasta-one-pot",
    "title": "مكرونة الجمبري بالليمون والثوم في حلة",
    "creatorId": "tasty-channel",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "جمبري",
      "مكرونة",
      "ليمون"
    ],
    "textures": [
      "دافئ ومشبع"
    ],
    "needs": [],
    "why": "نسخة أخرى بمكرونة وجمبري وثوم وليمون من قناة Tasty، غير النسخة المذكورة في التقرير.",
    "sources": [
      {
        "ytId": "_M9MHFhANw4",
        "kind": "video",
        "published": "06/2016",
        "uploadedAt": "2016-06-25",
        "durationSec": 56,
        "views": 2835313,
        "sourceNo": 142
      }
    ],
    "views": 2835313,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "funfetti-dot-cake",
    "title": "دوت كيك بالفانيليا والسبرينكلز",
    "creatorId": "ashley-treats",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "كيك",
      "بيض"
    ],
    "textures": [
      "كريمي",
      "مقرمش"
    ],
    "needs": [],
    "why": "كيك فردي بطبقات كريمة ووش سبرينكلز ملوّنة، من فيديو Ashley Markle Treats.",
    "sources": [
      {
        "ytId": "1p6u2fHDUqI",
        "kind": "short",
        "published": "05/2026",
        "uploadedAt": "2026-05-22",
        "durationSec": 52,
        "views": 13411832,
        "sourceNo": 143
      }
    ],
    "views": 13411832,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "phyllo-crinkle-cake",
    "title": "كيكة الجلاش المجعّد بالكاسترد والفستق",
    "creatorId": "faridas-kitchen",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "جلاش",
      "حليب",
      "فستق"
    ],
    "textures": [
      "مقرمش",
      "كريمي"
    ],
    "needs": [],
    "why": "رقائق جلاش مجعّدة بالزبدة والكاسترد وشربات وفستق، من وصفة Faridas Kitchen.",
    "sources": [
      {
        "ytId": "ZJzzgqkiUpI",
        "kind": "video",
        "published": "09/2025",
        "uploadedAt": "2025-09-13",
        "durationSec": 263,
        "views": 1338,
        "sourceNo": 144
      }
    ],
    "views": 1338,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "watermelon-frozen-ice-cream",
    "title": "آيس كريم البطيخ المجمد",
    "creatorId": "hydrow",
    "category": "حلويات باردة",
    "mainIngredients": [
      "بطيخ",
      "حليب جوز الهند"
    ],
    "textures": [
      "منعش",
      "كريمي"
    ],
    "needs": [],
    "why": "بطيخ مجمد مضروب مع حليب جوز الهند أو الزبادي؛ راجعي الفيديو لتفاصيل القوام والتجميد.",
    "sources": [
      {
        "ytId": "1f7TFDOTh60",
        "kind": "short",
        "published": "06/2024",
        "uploadedAt": "2024-06-24",
        "durationSec": 30,
        "views": 1255,
        "sourceNo": 145
      }
    ],
    "views": 1255,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "frozen-strawberry-yogurt-clusters",
    "title": "عناقيد الفراولة والزبادي بالشوكولاتة",
    "creatorId": "ms-vegan",
    "category": "حلويات باردة",
    "mainIngredients": [
      "فراولة",
      "زبادي",
      "شوكولاتة"
    ],
    "textures": [
      "شوكولاتة",
      "منعش"
    ],
    "needs": [],
    "why": "فراولة وزبادي نباتي مجمّدين في قطع ومغطّيين بالشوكولاتة؛ الفيديو يشرح نسخة نباتية من الفكرة.",
    "sources": [
      {
        "ytId": "juNd6Ra1rPI",
        "kind": "video",
        "published": "08/2024",
        "uploadedAt": "2024-08-09",
        "durationSec": 131,
        "views": 1975,
        "sourceNo": 146
      }
    ],
    "views": 1975,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "smash-burger-tacos",
    "title": "تاكو السماش برجر بالجبنة",
    "creatorId": "kingsford",
    "category": "عشاء وسندوتشات",
    "mainIngredients": [
      "لحمة مفرومة",
      "تورتيلا",
      "جبنة"
    ],
    "textures": [
      "مقرمش",
      "سايح بالجبنة"
    ],
    "needs": [],
    "why": "لحمة مفرومة مضغوطة على تورتيلا مع جبنة وخس ومخلل؛ فيديو Kingsford يشرح الصوص كمان.",
    "sources": [
      {
        "ytId": "6rTjKIewJu4",
        "kind": "short",
        "published": "03/2026",
        "uploadedAt": "2026-03-23",
        "durationSec": 22,
        "views": 18987499,
        "sourceNo": 147
      }
    ],
    "views": 18987499,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "turkish-pasta-yogurt",
    "title": "المكرونة التركية بالزبادي واللحمة",
    "creatorId": "dominidenn",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "مكرونة",
      "زبادي",
      "لحمة مفرومة"
    ],
    "textures": [
      "كريمي",
      "دافئ ومشبع"
    ],
    "needs": [],
    "why": "نسخة Dominidenn من المكرونة بالزبادي والثوم واللحمة وزبدة البابريكا.",
    "sources": [
      {
        "ytId": "E_gy3gHs0Eg",
        "kind": "video",
        "published": "12/2024",
        "uploadedAt": "2024-12-05",
        "durationSec": 179,
        "views": 14663,
        "sourceNo": 148
      }
    ],
    "views": 14663,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "creamy-gochujang-noodles",
    "title": "نودلز كريمي بالغوتشوجانغ",
    "creatorId": "food-breaker",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "نودلز",
      "فلفل",
      "مشروم"
    ],
    "textures": [
      "كريمي",
      "حار"
    ],
    "needs": [],
    "why": "نودلز بصوص كريمي ومعجون فلفل كوري وخضار؛ المقادير التفصيلية في فيديو المصدر.",
    "sources": [
      {
        "ytId": "QuG4T7e0w-A",
        "kind": "video",
        "published": "12/2023",
        "uploadedAt": "2023-12-22",
        "durationSec": 130,
        "views": 1565,
        "sourceNo": 149
      }
    ],
    "views": 1565,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "mexican-mangonada",
    "title": "مانغونادا بالمانجا والليمون والشطة",
    "creatorId": "golden-balance",
    "category": "مشروبات",
    "mainIngredients": [
      "مانجا",
      "ليمون"
    ],
    "textures": [
      "منعش",
      "حار"
    ],
    "needs": [],
    "why": "مشروب مانجا مجمدة وليمون مع تشاموي وتاجين؛ مثال ملموس لفكرة الفاكهة مع الحار.",
    "sources": [
      {
        "ytId": "wkhgeNmwiKo",
        "kind": "short",
        "published": "03/2026",
        "uploadedAt": "2026-03-17",
        "durationSec": 46,
        "views": 467413,
        "sourceNo": 150
      }
    ],
    "views": 467413,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "cottage-cheese-ranch-dip",
    "title": "غموس الجبنة القريش بالرانش",
    "creatorId": "molly-thompson",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "جبنة قريش",
      "زبادي"
    ],
    "textures": [
      "كريمي"
    ],
    "needs": [],
    "why": "جبنة قريش مخفوقة مع زبادي وأعشاب وتوابل رانش؛ يقدّمها المصدر مع خضار أو مقرمشات.",
    "sources": [
      {
        "ytId": "j9hWoL3uSSY",
        "kind": "video",
        "published": "02/2023",
        "uploadedAt": "2023-02-28",
        "durationSec": 90,
        "views": 4197,
        "sourceNo": 151
      }
    ],
    "views": 4197,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "japanese-milk-bread-shokupan",
    "title": "خبز الحليب الياباني شوكوبان",
    "creatorId": "pastry-living",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "دقيق",
      "حليب"
    ],
    "textures": [
      "إسفنجي"
    ],
    "needs": [],
    "why": "خبز حليب ياباني بطريقة التانغزونغ من قناة Pastry Living؛ ترشيح فيديو للشرح الكامل.",
    "sources": [
      {
        "ytId": "-MAawoZ8HQA",
        "kind": "video",
        "published": "08/2026",
        "uploadedAt": "2026-08-15",
        "durationSec": 426,
        "views": 25585,
        "sourceNo": 152
      }
    ],
    "views": 25585,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "hot-honey-chicken-bites",
    "title": "لقيمات دجاج مقرمش بالعسل الحار",
    "creatorId": "yum-recipes",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "دجاج",
      "عسل"
    ],
    "textures": [
      "مقرمش",
      "حار"
    ],
    "needs": [],
    "why": "دجاج متبّل ومغطى بكورن فليكس، مع صوص عسل وشطة؛ تابعي الفيديو لتفاصيل القلي.",
    "sources": [
      {
        "ytId": "bLXFmvtRtdU",
        "kind": "video",
        "published": "01/2026",
        "uploadedAt": "2026-01-14",
        "durationSec": 159,
        "views": 386,
        "sourceNo": 153
      }
    ],
    "views": 386,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "susla-puffed-rice",
    "title": "سوسلا الأرز المنفوش بالخضار",
    "creatorId": "jayas-cookbook",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "أرز منفوش",
      "بصل",
      "طماطم"
    ],
    "textures": [
      "متبّل"
    ],
    "needs": [],
    "why": "سناك سوسلا هندي من الأرز المنفوش والبصل والطماطم؛ الأرز المنفوش مش فشار.",
    "sources": [
      {
        "ytId": "qhQdnvfA7Fw",
        "kind": "video",
        "published": "03/2023",
        "uploadedAt": "2023-03-04",
        "durationSec": 132,
        "views": 594,
        "sourceNo": 154
      }
    ],
    "views": 594,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "shaved-frozen-pineapple",
    "title": "أناناس مجمّد مبشور بجوز الهند",
    "creatorId": "amanda-freitag",
    "category": "حلويات باردة",
    "mainIngredients": [
      "أناناس",
      "جوز الهند"
    ],
    "textures": [
      "منعش"
    ],
    "needs": [],
    "why": "أناناس مجمد مبشور يقدم مع جوز الهند وبشر الليمون؛ دي نسخة من فكرة الفواكه المجمدة المبشورة.",
    "sources": [
      {
        "ytId": "YDuEnUdr_R4",
        "kind": "short",
        "published": "06/2025",
        "uploadedAt": "2025-06-02",
        "durationSec": 28,
        "views": 1527,
        "sourceNo": 155
      }
    ],
    "views": 1527,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "mango-chicken-salad",
    "title": "سلطة الدجاج والمانجا والأفوكادو",
    "creatorId": "baking-cooking-fun",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "دجاج",
      "مانجا",
      "أفوكادو"
    ],
    "textures": [
      "منعش"
    ],
    "needs": [],
    "why": "سلطة دجاج ومانجا وأفوكادو بصلصة ليمون وعسل؛ فيديو قديم من BakingCookingFun.",
    "sources": [
      {
        "ytId": "CZ_UxLz1S4w",
        "kind": "video",
        "published": "02/2018",
        "uploadedAt": "2018-02-15",
        "durationSec": 247,
        "views": 143,
        "sourceNo": 156
      }
    ],
    "views": 143,
    "viewsUpdatedAt": "2026-11-06"
  }
];
