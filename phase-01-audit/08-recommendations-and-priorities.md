# Recommendations and priorities

All recommendations are for subsequent review; none implemented. Complexity is relative, excluding validation and content remediation.

| Order | Finding | What / why / problem solved | Expected improvement | Dependencies | Complexity |
|---|---|---|---|---|---|
| 1 | F01 P1 | Preserve relevance order for a text query or explicitly prioritize exact title matches, then allow users to change sort. A matching title currently appears 11th. | Fewer comparisons to reach a known dish; measure rank and task completion. | Define ranking precedence across sort options, Arabic variants, recipe titles and reviewed ingredients; regression tests. | M |
| 2 | F02 P1 | Honor valid `sort` query values and visibly reflect the chosen sort; ensure homepage trend links reach intended order. | Trustworthy deep links and predictable arrival. | Define invalid params/default; direct-load, history and sort tests. | S–M |
| 3 | F03 P2 | Either label generic fallbacks “اقتراحات شائعة” or implement demonstrably relevant alternatives; never label arbitrary popularity as nearest. | Accurate feedback when no match exists. | Editorial wording or relevance model; empty-state tests. | S for copy; M–L for relevance |
| 4 | F04 P2 | Separate evergreen descriptions from review-state messaging or derive the latter from current status; audit all six recently reviewed cards. | Trust in whether written ingredients are available. | Editorial review of current catalog; no assumed production-data change. | S–M |
| 5 | F05 P2 | Test a bounded creator preview with the existing directory link, without hiding search or permanently removing creators. | Shorter home content if mobile research confirms burden. | User testing, diversity selection rules, verify all creators remain discoverable. | S–M |

Before any implementation, finish responsive, interactive and accessibility evidence collection. Then verify baseline metrics (exact-match rank, trend destination state, recovery from zero results, user comprehension and mobile time to reach footer). Avoid an unvalidated wholesale navigation redesign.
