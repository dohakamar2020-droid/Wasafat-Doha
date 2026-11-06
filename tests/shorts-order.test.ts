import { test } from "node:test";
import assert from "node:assert/strict";
import { shuffleShorts, spreadShortCreators } from "../lib/shorts-order";

test("shuffle is non-mutating and uses randomness", () => {
  const input = [1, 2, 3, 4];
  assert.deepEqual(shuffleShorts(input, () => 0), [2, 3, 4, 1]);
  assert.deepEqual(input, [1, 2, 3, 4]);
  assert.notDeepEqual(shuffleShorts(input, () => 0), shuffleShorts(input, () => 0.99));
});

test("creator spread avoids adjacent creators when alternatives exist and honors a starting short", () => {
  const items = ["a", "a", "a", "a", "b", "b", "c"].map((creatorId, i) => ({ creatorId, slug: String(i) }));
  const ordered = spreadShortCreators(items);
  assert.equal(ordered.length, items.length);
  assert.equal(new Set(ordered.map(r => r.slug)).size, items.length);
  assert.ok(ordered.every((r, i) => !i || r.creatorId !== ordered[i - 1].creatorId));
  const started = spreadShortCreators(items, "5");
  assert.equal(started[0].slug, "5");
  assert.equal(started[1].creatorId, "a");
});

test("a single creator is retained when variety is impossible", () => {
  const items = [1, 2, 3, 4].map(i => ({ creatorId: "a", slug: String(i) }));
  assert.deepEqual(spreadShortCreators(items), items);
  assert.deepEqual(spreadShortCreators([]), []);
});
