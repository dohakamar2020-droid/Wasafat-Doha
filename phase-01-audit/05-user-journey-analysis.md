# Journey analysis — partial route probes, not completed user tests

The service fetches URLs separately. It did not click controls or simulate browser history; these are route/content probes rather than observed end-to-end human journeys. Step counts are minimum **planned interactions**, not measured clicks or completion times.

## J1 — First visit, find something to cook
1. Open `/` (retrieved); hero explains curated chef clips and provides search/discovery CTAs. Five-second comprehension untested.
2. Potential entry “اكتشف الوصفات” → `/discover` (both source link and destination retrieved). Active state and click behavior untested.
3. Browse card text and choose, e.g. شاورما الدجاج; direct `/recipes/chicken-shawarma` was retrieved. It is a video recommendation, not reviewed written steps. Choosing and clicking it were **not** tested.
4. Risks to validate: adjacent discovery/recommendation CTAs, F05 long creator inventory. Do not infer abandonment.

## J2 — Known dish and filter
1. Homepage search exists in source; form submission untested.
2. Direct URL `?q=شاورما الدجاج` returned 19; exact match is 11th (F01).
3. Direct combination `?cat=فطار&status=reviewed` returned four and active labels; this is a separate probe, not applying a filter to the shawarma query.
4. Remove/change a filter, back/forward, clear and select a card: **not tested**. Recipe URL fetched directly, not clicked. Missing feedback or failures in these interactions cannot be claimed.

## J3 — Exploratory
1. Home text offers “على مزاجك”, recipe rails, and a link to collections within the meal section.
2. Direct `/collections` retrieved editorial collections; `/collections/fridge-desserts` returned 13 cards, some complete and some video-only.
3. Cards provide comparison attributes: creator, category, status, view count; actual comparative scan and responsive layout untested.
4. Open a recipe and compare multiple cards by clicking: **not tested**. CTA prominence and content fatigue need real user observation. F04/F05 provide content-based starting points.

## Completion criteria for follow-up
Run each scenario on an actual mobile and desktop browser, record entry-to-selection clicks, search/filter state, participant expectations, failed actions and screen captures. Report success only after the last action actually occurs; keep recipe-detail and recommendation questionnaire audit out of scope.
