# Homepage audit

## Complete content inventory
Production homepage text was retrieved in five chunks on 6 November 2026. This is text order, not a measured visual/scroll order or 5-second test. Repository source identifies conditional components. No viewport screenshot is available.

| Order | Section | User job / observation |
|---|---|---|
| 1 | Hero | Headline “وصفة تستاهل تقول: لازم أجرّبها”, supporting description, search, four CTAs, library counts and three recipe images. |
| 2 | شوف الفكرة بسرعة | Four shorts; “كل الشورتس” → `/watch`. |
| 3 | Resume cooking | Conditional in source; not visible in retrieved fresh-state text. |
| 4 | ابدأ من خطوتك | Five discovery-to-cooking journey links. |
| 5 | جاهزين للطبخ | Four reviewed cards; “كل الوصفات المكتملة” → filtered discovery. |
| 6 | الترند دلوقتي | Conditionally rendered; four cards and “كل الترند” → `?sort=trend` (F02). |
| 7 | Saved strip | Conditional in source; absent in retrieved fresh-state text. |
| 8 | على مزاجك | Six intent shortcuts, including texture and cold-dessert filters. |
| 9 | فكرة مختلفة تستاهل التجربة | Five editor picks. |
| 10 | عندك إيه في البيت؟ | Ingredient shortcuts and input-journey CTA. |
| 11 | من وصفة لسفرة | Meal cards and link to editorial collections. |
| 12 | اختيارات الأسبوع | Up to three weekly cards; observed contradictory reviewed badge vs copy (F04). |
| 13 | من أول تجربة… لنسختك الخاصة | Four feature entry points. |
| 14 | الشيفات اللي بتحبهم | All 152 creator entries and a “شوف الكل” link (F05). |
| 15 | Footer | Navigation, source attribution, information and account links; map in IA report. |

## Hero and CTA assessment
The text explains curated chef clips and choosing/cooking but the headline alone does not describe the service. Four adjacent hero paths (اكتشف، رشحلي 3، رشحلي ٥، كل المزايا) plus search compete as possible starting actions. This is a **design hypothesis**, not a measured failure: test first-visit comprehension and which action people choose before changing hierarchy. “كل الترند” is a verified destination-intent problem, F02. Other CTA click behavior and placement were not tested.

## Cards
Text retrieval confirms title, creator, category, badge for format/review state, views and sometimes ingredients or editorial reason. Example: weekly “كرات الطاقة بالتمر والشوفان” has “مقادير وخطوات” and a reason that says “ترشيح فيديو” (F04). Source renders the image and title as separate recipe links, creator as a separate link, and save/hide controls; whether whitespace is clickable was not physically tested. Short image links into `/watch?start=...`, but short title links to recipe; distinguish play and recipe destinations in an interactive test. Time is displayed only where provided; do not invent missing preparation times. The text retrieval cannot evaluate crop, dimensions, image quality, colors, contrast, hover or spacing.

## Candidate order for testing, not a redesign
Keep hero search and a clear discovery entry; place a concise, actionable reviewed-recipe selection near the top for users ready to cook; retain the shorts rail as requested; follow with a small number of intent-based entry points, then discovery/editorial sections and other utilities; limit chef preview and offer the full directory (F05). Validate against existing user behavior and business goals. Do not add another section simply to make the page longer. A short explanation differentiating “رشحلي 3” and “رشحلي ٥” is a testable CTA-label improvement, not a confirmed bug.
