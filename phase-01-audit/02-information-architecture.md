# Information architecture and navigation

## Existing map
The following header/footer inventory is from repository source at `ff75182` (`components/NavLinks.tsx`, `app/layout.tsx`), not an interactive verification of every production navigation control. Production homepage text was separately retrieved. Header: logo → `/`; primary links: `/watch` الشورتس, `/videos` الفيديوهات, `/discover` اكتشف, `/pick` رشحلي 3, `/pick-five` رشحلي ٥, `/ingredients` عندك إيه؟, `/meals` السفرات, `/creators` الشيفات, `/features` كل المزايا, `/kitchen` مطبخي. Actions: search → `/discover`; رشحلي 3; محفوظاتي → `/kitchen/saved`; authentication.

Mobile bottom bar in source: الرئيسية, شورتس, فيديوهات, اكتشف, المزايا, مطبخي. This is not a hamburger menu in the inspected implementation; menu opening, overlay and dismissal therefore do not apply to that component. Actual screen behavior and any other responsive navigation remain untested. `isActive` marks exact path or descendants; client-side active appearance is unverified.

Footer groups in source: اتفرج واختار (discovery, shorts, videos, both recommendation tools, collections, meals, weekly, same ingredient, compare); جهّز واطبخ (ingredients, features, shopping, tips, hidden, saved, passport); chefs; مطبخي والموقع (kitchen, attempts, about, privacy, contact, login). Logo is linked to `/` in source; sticky behavior not interactively checked.

## Direct retrieval coverage, not clicks
Production text retrieved: `/`, `/discover`, `/watch`, `/videos`, `/features`, `/pick`, `/collections`, `/collections/fridge-desserts`, `/recipes/chicken-shawarma`, and discovery query URLs. **Not individually retrieved:** `/pick-five`, `/ingredients`, `/meals`, `/creators`, `/kitchen`, all footer and logo links. No click, refresh, back, forward, active visual, menu, touch, keyboard, focus or broken-link sweep was performed. Direct URL success does not establish navigation click behavior or absence of broken links.

## Structural observations and restrained proposal
- There are ten top-level links in source, plus actions; both “رشحلي 3” and “رشحلي ٥” are present and home repeats both. Their distinctions are present in longer copy, but first-time comprehension needs testing; do not call them confusing as a confirmed user finding.
- `/collections` is not a top-level link in the listed header; it appears in footer and a home meal section. Discoverability needs user testing, not a predetermined redesign.
- Collections and meals are distinct (editorial themes vs assembled meals), though the features directory combines the wording. Test whether people distinguish them before regrouping.
- Recommended experiment, not a validated IA: group viewing under “اتفرج”, recipe browsing/collections under “اكتشف”, and retain an obvious “مطبخي”; keep direct paths to recommendations and ingredient search. Validate task completion and findability before changing anything. Avoid hiding important tasks merely to reduce link count.
- “كل الترند” points to discovery’s `sort=trend`; the observed destination does not honor the promise (F02), despite resolving.
