# Wasafat Doha — Full Website UX/UI Audit & Phase 02 Implementation Plan

**Audited:** https://wasafat-doha-woad.vercel.app/ · **Date:** 6 November 2026 · **Scope:** all major product journeys.  
**Document status: consolidated, evidence-limited audit and implementation plan; NOT a complete interactive, accessibility or responsive certification.**  
**Authoritative issue list:** [unified-issue-backlog.csv](unified-issue-backlog.csv). Prior files in `phase-01-audit/` are preserved as the earlier work and evidence archive; this consolidated report and backlog supersede their status/priority lists, without renumbering F01–F05.

## 1. Executive assessment

Wasafat Doha offers multiple useful routes from inspiration to cooking, attributes source creators, distinguishes reviewed written details from video-only recommendations and discloses uncertainty around cooking times. Direct page retrieval demonstrates that major pages return meaningful Arabic content. However, known-item search ranks a matching title poorly (F01), a trend deep link does not appear to honor its sort (F02), account creation is unavailable in the observed deployment (F08), and an example chicken recipe can imply a fixed cooking time guarantees doneness (F06). Content contradictions and overloaded or ambiguous selection lists add friction (F03–F05, F07, F09–F10).

**10 findings: P0 0, P1 4, P2 6, P3 0.** F05 confirms volume, not actual user struggle; F06 is a safety-risk assessment, not a report of harm; F08 is an observed availability state, not a diagnosis of cause. No P0 was observed; this does not establish there are none. Priorities are provisional until hands-on tests are run.

**No application implementation, commit, production modification, or seed was performed.** Phase 02 below is a plan only. Important untested interactions and viewport coverage are listed in §11; do not sign off the site or infer compliance from this document.

## 2. Method, evidence and limitations

- **Production observations (P):** the page retrieval tool opened actual production URLs and returned page text, sometimes after client rendering. URL probes test direct arrival and returned output only. They do not establish that a user clicked, typed, scrolled, refreshed, used browser back/forward or completed a workflow.
- **Source observations (S):** read-only checkout at `ff75182`, particularly `app/layout.tsx`, `components/NavLinks.tsx`, `app/page.tsx`, `app/discover/page.tsx`, and `lib/data.ts`. Deployed commit identity was not independently established; source is corroboration, not proof of deployed behavior.
- **Browser limitation:** sandbox `curl` to the production host failed with `SSL_ERROR_SYSCALL`; no local browser executable or controllable browser tool is available. The retrieval tool renders content but does not expose viewport, clicks, real devices or screenshots. `/watch` retrieval produced a `youtube-nocookie.com ERR_CONNECTION_CLOSED` inside the tool; the test environment's network restrictions prevent determining whether ordinary visitors experience that. It is **not** logged as a production outage.
- No screenshots were possible. Missing screenshots and six viewport sizes are not passes. No user study, Lighthouse, Web Vitals, screen-reader, keyboard, color-contrast or automated accessibility audit was performed. No real customer accounts were used or created.
- Previously documented full home inventory and search probe matrix remain in [prior Phase 01 archive](../phase-01-audit/03-homepage-audit.md) and [search report](../phase-01-audit/04-search-discovery-audit.md); baseline evidence and links in [production observations](../phase-01-audit/evidence/production-observations.md).

## 3. Prior findings F01–F05: verification

| ID | Recheck | Current status and evidence |
|---|---|---|
| F01 | Same direct search URL | **Reproduced:** شاورما الدجاج returned 19 results, exact title 11th. P1. [Query](https://wasafat-doha-woad.vercel.app/discover?q=%D8%B4%D8%A7%D9%88%D8%B1%D9%85%D8%A7%20%D8%A7%D9%84%D8%AF%D8%AC%D8%A7%D8%AC). |
| F02 | Re-fetched default and trend URLs | **Supported/reproduced at output level:** same first five, corroborated by source initializing editor sort. P1. [Trend](https://wasafat-doha-woad.vercel.app/discover?sort=trend); changing selector untested. |
| F03 | Direct nonsense query | **Reproduced:** 0 results yet generic popular items introduced as “أقرب اختيارات”. P2. [Query](https://wasafat-doha-woad.vercel.app/discover?q=xyzqnotfound123). |
| F04 | Home weekly text | **Reproduced:** the same three cards have reviewed badges and video-only copy. P2. [Home](https://wasafat-doha-woad.vercel.app/). |
| F05 | Home creator section | **Reproduced volume, impact unverified:** creator inventory and directory link both remain. P2 conditional on real mobile validation. |

## 4. Information architecture and navigation

Source inventory: header links الشورتس `/watch`, الفيديوهات `/videos`, اكتشف `/discover`, رشحلي 3 `/pick`, رشحلي ٥ `/pick-five`, عندك إيه `/ingredients`, السفرات `/meals`, الشيفات `/creators`, كل المزايا `/features`, مطبخي `/kitchen`; header actions include search, saved and account. Mobile source shows a bottom bar for home, shorts, videos, discover, features and kitchen. Footer groups viewing/choosing, preparation/cooking, chefs, and kitchen/site. Logo links home; active matching is implemented for matching routes and descendants. See [previous map](../phase-01-audit/02-information-architecture.md).

Product architecture has intentionally overlapping routes: `pick` asks mood/time/priority; `pick-five` combines up to five ingredients and preferences; `ingredients` accepts pantry inputs and excludes terms. They serve different jobs but similar calls to action; their distinctness to first-time users is an **unverified hypothesis**, not a confirmed duplication defect. Collections group editorial themes; meals group complementary dishes and planning. Test labels and findability before any wholesale restructure. “كل الترند” link undermines destination expectation (F02). F05 describes a large home creator section, not a broken link.

**Not verified:** clicking each item, responsive header/menu, sticky behavior, logo, active state, dropdowns, footer, external links, browser navigation, focus order and accidental menu closure. Direct URLs that returned content include `/`, `/discover`, `/features`, `/watch`, `/videos`, `/pick`, `/pick-five`, `/ingredients`, `/collections`, `/creators`, `/meals`, `/kitchen`, `/login`, `/register` and sampled child routes. No blanket broken-link claim is made.

## 5. Homepage and visual content

The hero offers a curated-chef proposition, search, four CTAs and catalog counts. The text is meaningful, but comprehension in five seconds and visual hierarchy are untested. The observed sequence is hero → four shorts → journey → reviewed recipes → trend → moods → discoveries → pantry → meals → weekly → feature entry points → creators; source adds conditional resume/saved strips. Cards expose source kind, creator, category, view count, review status and sometimes editorial reason; no visual dimensions, crop or contrast were measured. The complete inventory in the prior home audit remains applicable to the observed page.

F04 is a direct contradiction in status copy; F05 is confirmed data volume, with user impact requiring study. Suggested experiment: retain hero/search, shorts and a concise reviewed selection; limit the home creator preview only after measuring discovery and scroll cost. Avoid adding sections for decoration. Check if the two recommendation CTAs need short differentiating copy using actual user tasks.

## 6. Search, filters, discovery and taxonomy

Direct production probes: exact `شاورما الدجاج` 19 with exact result 11th (F01); partial `شاور` 1 matching title; `فراخ` 40; `غلاش` 7; `حلويات` 47; `بطاطس` 21; surrounding spaces around `فراخ` returned 40 and the same first result; `بطاطسسس` 0; nonsense query 0 with generic fallback (F03). Counts are captured observations, not guarantees or evidence of general semantic search. `cat=فطار&status=reviewed` yielded 4 and two active labels; changing/removing/resetting was not tested.

Source defines chips for reviewed, shorts, no oven, few ingredients and meals; selectors for category, creator, video format, texture, need, main ingredient, review status and sort. Sort options include editor, views, trending, latest and alphabetical. Meal “فطار” and category “فطار” are separate axes; ingredient dropdown searches main ingredients whereas text search also draws on reviewed ingredient text (source evidence). Validate whether users understand the distinction, especially since pantry tools use different vocabularies. F07 confirms duplicate orthographic labels in the pantry ingredient inventory; it does not prove wrong match results. Default paging and “load more” exist in source; page incrementing was not clicked.

## 7. Recommendation systems

Production `/pick` describes three questions and explicitly warns only **1 of 264** recipes has a documented total time at capture; that limitation avoids fabricating data but may limit time-constrained recommendations. `/pick-five` explains up to five *available ingredients*, not recipes with five ingredients; offers optional taste/category/method/status/time and says filters are not relaxed automatically. `/ingredients` accepts free text and exclusion, warns exclusions are not allergy guarantees, and advertises matching on reviewed ingredients. `/same-ingredient` offers three different recipe ideas. These disclosures are strengths.

Each route's initial text was retrieved, but selection, scoring, replacements, allergy exclusions, zero results, ingredient caps, filter persistence and link destinations were not operated. Large ingredient catalogs and overlapping recommendation labels warrant real user testing, not a presumed algorithm bug. F07 addresses observed duplicated label variants only. Do not infer system quality or safety from initial copy.

## 8. Recipe details and cooking mode

Two examples were retrieved: `/recipes/chicken-negrisco` displays reviewed ingredient groups, numeric scaling controls, instructions, source links, estimated video timestamps, review statement and user-note/attempt areas; `/recipes/chicken-shawarma` clearly identifies itself as a video recommendation without reviewed written steps. Both direct cooking URLs render: reviewed negrisco shows step 1/7 with cues, step ingredients, next controls, timers and notes; shawarma says written steps remain under review and offers video/timer/notes instead. These are content observations, not proof controls work.

**F06 safety:** negrisco text advises “مش أكتر من 5 دقائق” and “5 دقائق على نار عالية كفاية للشرائح”. Time/appearance alone cannot reliably establish safe poultry temperature; safety review should clarify safe internal temperature and preserve distinction from the creator's instruction. No claim of actual unsafe served food was observed.

Not tested: scaling math and rounding, pantry limiting, adding shopping, step completion/resumption, multiple timers, notifications, wake lock, YouTube playback/timestamps, cross-device progress, substitutions, errors or photo upload. Estimated timestamps are explicitly labelled approximate in retrieved text. Direct `/cook` endpoints are not evidence of an end-to-end click path.

## 9. My Kitchen, personalization, account, meals

`/kitchen` guest state showed 0 saves/plans/attempts/items, pantry shelf, week planner and the disclosure that the week plan is device-local. `/kitchen/saved`, `/kitchen/hidden`, `/kitchen/attempts` and `/kitchen/shopping` supplied empty-state guidance; no data was written. `/meals/family-lunch` disclosed which dishes lack documented time and omits them from the calculated schedule; actual add-to-shopping and scheduling interactions were not tested. `/passport` shows a chocolate journey starting with mango ice cream (F10), an editorial mismatch: [the linked recipe](https://wasafat-doha-woad.vercel.app/recipes/mango-ice-cream) lists mango, sugar and cream, with no chocolate in the displayed ingredients.

`/register` returned “الحسابات غير متاحة مؤقتًا”; `/api/health/db` returned `configured:false`, `connected:false`, `schemaReady:false`, `accounts:false` (F08). This confirms observed availability state at inspection, not its duration, full user impact, cause or whether every login attempt fails. Registration also promises plans sync while kitchen explicitly says weekly plan is local (F09); cloud state, guest migration, account isolation, sign-in/out, password recovery and cross-device sync are untested. No production seed/configuration change is authorized by this audit.

## 10. RTL, visual system, accessibility and performance

Read-only source provides `lang=ar`, `dir=rtl`, a skip link, labels on several inputs and `aria-current` in navigation; text retrieval shows mixed Arabic, English names and Western numerals. These do not establish proper bidi presentation, accessible names everywhere or keyboard/screen-reader usability. The rendered palette, typography, contrast, card/image aspect ratios, focus/hover/disabled states and component spacing were **not visually inspected**. Typography, icon direction, button sizes, reflow, overflow and touch targets require device testing.

No performance benchmark, loading waterfall, resource size, Core Web Vitals or error simulation was run. Multiple long lists and iframe loading are hypotheses to profile, not confirmed performance defects. Empty search and guest states were observed in text; form validation, saving feedback, failures and network recovery are untested. Avoid inventing UI, accessibility or speed findings from source alone.

## 11. Journey, responsive and test coverage matrix

| Journey / area | Direct page evidence | Real interaction / outcome |
|---|---|---|
| First-time visitor → browse → recipe | home, discover and shawarma URL retrieved | Not tested as a contiguous click journey; 5-second comprehension unknown |
| Exact search → filter → choose | exact and combined-filter URLs retrieved separately | Typing, applying/removing filters, click and back/forward not tested |
| Exploratory → collection → recipe | collection index/detail and recipe URLs retrieved | Actual traversal/choice not tested |
| Three recommendation systems | initial pick, pick-five, ingredients, same-ingredient states retrieved | Input, results, constraints, reset and feedback not tested |
| Reviewed and video-only recipes → cook | both detail and cook URLs retrieved | Completion, timing, video, scaling and persistence not tested |
| Save → kitchen → plan → shopping | empty kitchen/saved/shopping pages retrieved | Save/add/plan/refresh, transfer and persistence not tested |
| Registration → login → sync → other device | register page and DB health retrieved | No account creation/login or sync tested; accounts reported unavailable |
| Meal → schedule/shopping | family-lunch text retrieved | Time changes, conflicts and add-to-list not tested |
| Desktop 1440 and 1366 | no controllable viewport | NOT TESTED; no screenshots |
| Tablet 768 | no controllable viewport | NOT TESTED; no screenshots |
| Mobile 430, 390, 360 | no controllable viewport | NOT TESTED; no screenshots |

**Capture and test follow-up:** on real/staging browsers, capture full-page and initial views, responsive nav, query and no-result, filtered state, recommendations results, reviewed/video-only details, step/timer, empty/populated kitchen, account failure and meal plan. At all six widths assess clipping, horizontal overflow, RTL/bidi, target size and focus; use keyboard and screen reader; test 200% zoom and contrast. Exercise video in a network that can access YouTube. Test offline/error behavior with test data. Keep screenshots free of personal data. No screenshot is supplied or claimed.

## 12. Phase 02 — complete implementation plan (do not implement yet)

### Workstream A — safety and service availability (F06, F08; priority 0)
1. **Food safety / content:** have a qualified editorial reviewer identify every poultry instruction that suggests time/color alone ensures doneness. Correct F06 with verified safe internal-temperature guidance (74°C / 165°F), without attributing added safety notes to the source. Verify reheating, portions and varied cooking equipment where applicable. Acceptance: reviewed text distinguishes estimated timing and safety check; original source attribution remains; relevant recipe and cook views agree. Unit/content checks plus human review.
2. **Accounts availability:** diagnose Vercel environment and database health in a safe environment. Decide whether account service is intended to be active. Configure/migrate with a documented recovery plan; assess existing production data and back it up before any migration or seeding. If intentionally unavailable, make guest-only status and expected recovery clear. Acceptance: if enabled, registration/login/logout and `/api/health/db` match actual state, with controlled test account and guest data isolation; if disabled, all entry points explain limits consistently. Do not infer a quick configuration fix or run seed blindly.

### Workstream B — search and entry intent (F01, F02; priority 1)
3. Define ranking precedence: exact normalized title, phrase, partial matches, synonyms and editorial tie-breakers. Preserve relevance when entering a search unless the user explicitly chooses a different order; retain Arabic normalizations and prevent unintended regression in query aliases. Acceptance: exact shawarma is top relevant match; partial `شاور`, `فراخ`, `غلاش`, spaces and no-match cases have deterministic coverage; explicit sort remains understandable.
4. Parse and validate `sort` deep links; synchronize visibly selected control, query URL and back/forward. Acceptance: home trend CTA, direct URL, refresh and navigation return trend ordering; invalid values fall back explicitly; filters and chosen sort remain coherent. Add unit and browser regression tests.

### Workstream C — trust and taxonomy (F03, F04, F07, F09, F10; priority 1–2)
5. Relabel generic zero-result suggestions or implement measured similarity, ensuring counts remain 0 until filters/query change (F03). 6. Correct stale review text and make status-driven copy consistent across homepage, weekly and recipe views (F04). 7. Canonicalize pantry display labels with aliases; preserve distinct ingredients and constraints and verify existing saved/entered values (F07). 8. Correct the precise weekly-plan sync claim immediately; if sync is later added, define guest migration, concurrent edit policy and privacy guarantees (F09). 9. Review chocolate path membership against actual recipe data or rename it without fabricating content (F10). Acceptance: snapshot/content tests for contradictory labels, alias tests including جبنة/جبنه without merging materially distinct items, and consistent guest/account copy; editorial approval for recipe/path changes.

### Workstream D — navigation, homepage and cross-device quality (F05; priority 3 after measurement)
10. Measure whether a bounded chef preview reduces scrolling without harming creator discovery. If validated, choose an equitable/deterministic selection with a visible directory link. A/B or moderated task checks; no arbitrary removal of creators. Test whether users distinguish `رشحلي 3`, `رشحلي ٥` and `عندك إيه`, collections vs meals before changing labels or grouping. Retain deep links and avoid restructuring without evidence.
11. Complete six-viewport RTL and accessibility audit, then implement only reproducible issues: semantics, keyboard, focus, target size, contrast, 200% zoom, screen-reader announcements and mixed-script bidi. Establish shared component states and consistent spacing only where measured issues exist. Acceptance: no horizontal overflow at target widths, all primary flows usable by keyboard/screen reader and WCAG checks reviewed by a human; attach screenshots.

### Workstream E — workflow robustness, performance and rollout
12. Browser test matrix for recommendation constraints and replacement/empty states; recipe scaling, video-only vs reviewed, timer background/notification, wake lock, step progress, save/hide, guest storage, shopping aggregation, weekly plan and logged-in sync. Isolate test data; verify cross-device and offline conflict handling without touching production user data. Confirm YouTube embedded playback, autoplay/sound and fallback using normal network.
13. Establish desktop/mobile performance baseline before optimization (LCP, CLS, INP, resource sizes, interaction latency); test cold/warm network and image/iframe load. Only optimize identified bottlenecks; compare before/after and monitor regression.
14. Release: scoped commits and PR, automated lint/typecheck/unit/browser/accessibility checks, editorial sign-off, preview screenshots and human QA, DB backup/migration review if required. Verify deployed commit and actual production URLs and health after release; retain rollback route and report any blocked verification. No implementation or production data operation in this audit.

**Dependencies and unresolved gates:** visual/device access, safe test account or staging environment, source-of-truth deployment identification, food-safety/editorial review and product decision on sync. Prioritize newly discovered P0/P1 issues if future interactive testing reveals them. The plan covers current verified issues plus the missing validation work; it cannot predict defects in untested journeys.
