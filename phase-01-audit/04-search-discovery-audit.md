# Search and discovery audit

## Method
Each example below was fetched directly from the production URL using a page-text retrieval service. This verifies a loaded URL and its returned content, not typing, live responsiveness, autocomplete, clearing, touch interaction, or navigation via the homepage search form. Counts are snapshots and may change with catalog updates. [Evidence URLs and excerpts](evidence/production-observations.md).

| Intent | Query / URL | Observed production output | Assessment |
|---|---|---|---|
| Exact Arabic title | `شاورما الدجاج` | 19 results; exact title 11th, after برياني and other chicken dishes | F01; poor exact-match ranking |
| Partial title | `شاور` | 1: شاورما الدجاج | Successful example |
| Category | `حلويات` | 47; first تشيز كيك المانجا | Matches the category example; no recall judgment |
| Ingredient | `بطاطس` | 21; first صينية البطاطس بالبشاميل | Successful example; result set includes ingredients from reviewed details and tags, not necessarily main ingredient only |
| Dialect | `فراخ` | 40; first دجاج بصوص الزبادي والكاري | Successful example |
| Spelling | `غلاش` | 7; first رولات الجلاش | Successful example, not general typo correction |
| Outer whitespace | two spaces + `فراخ` + two spaces | 40, same first item as `فراخ` | Same result count/top example; not every result compared |
| No match | `xyzqnotfound123` | 0, followed by four suggestions called closest | F03; unrelated popular fallback |
| Misspelling | `بطاطسسس` | 0, same fallback examples | No tested autocorrection for this typo. Whether to build it requires frequency/user research; not a standalone confirmed defect. |
| Combined filter | `cat=فطار&status=reviewed` | 4 results and two active labels | URL-based combined case works in retrieved output; clicking/removing/resetting untested |

No claim that every spelling or semantic query works. The input's search suggestions, autocomplete, history and clear button behavior were not interacted with; visible clear control and active labels are present in returned text for a query.

## Filter inventory and semantics
Source exposes quick toggles: reviewed, shorts, no oven, few ingredients and meal chips; advanced selectors: category, creator, source format, texture, need, main ingredient, review state and sort. Meal and category are separate concepts: “فطار” can appear in both, while e.g. “حلويات ومشروبات” is a meal grouping versus “حلويات باردة” a category. Test their meaning with users before adding taxonomy. Main-ingredient selection in source uses `mainIngredients` only, whereas text search also uses reviewed ingredient names; this difference can reasonably be documented in the UI, but its user impact is not measured.

Source initializes individual active chip removal and “خفف كل الفلاتر”; `shown` initially 24 with a “حمّل وصفات أكتر” button. Neither interaction has been exercised. Result count and applied chips were observed for direct URLs; persistence after refresh/edit, combinations across all controls, removal and mobile filters need interactive tests. Retrieval of select option text does **not** prove which panel is visually open.

## Sort
Source lists editor, YouTube views, recent trending, newest and alphabetical. Default editor prioritizes editor picks then views. `?sort=trend` is not read by the local `sort` initializer; production URL output corroborates same first five as base discovery (F02). Changing sort via the select, its selected appearance, and order for every mode remain untested.

## State coverage
Zero results and fallback were retrieved, including `0` count. Source contains a loading fallback and “load more”; loading, network error handling, keyboard/focus, responsiveness and performance were not exercised. No screenshots or evidence of actual visual density/overflow are available.
