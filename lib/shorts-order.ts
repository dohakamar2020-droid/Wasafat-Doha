/** Shuffle on each feed entry, without mutating the catalog. */
export function shuffleShorts<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Interleave creators, preferring the largest remaining group to avoid runs when possible. */
export function spreadShortCreators<T extends { creatorId: string; slug: string }>(items: readonly T[], start?: string): T[] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const group = groups.get(item.creatorId) || [];
    group.push(item);
    groups.set(item.creatorId, group);
  }
  const result: T[] = [];
  const first = (start && items.find(item => item.slug === start)) || items[0];
  if (first) {
    const group = groups.get(first.creatorId)!;
    group.splice(group.indexOf(first), 1);
    result.push(first);
  }
  while (result.length < items.length) {
    const previous = result[result.length - 1]?.creatorId;
    const available = [...groups.entries()].filter(([id, group]) => group.length && id !== previous);
    const candidates = available.length ? available : [...groups.entries()].filter(([, group]) => group.length);
    candidates.sort((a, b) => b[1].length - a[1].length);
    result.push(candidates[0][1].shift()!);
  }
  return result;
}
