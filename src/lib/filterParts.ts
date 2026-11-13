/**
 * Filters parts for the picker. Every whitespace-separated word of `query`
 * must appear in the part name (case-insensitive); `vendor` null means all.
 */
export function filterParts<T extends { name: string; vendor: string }>(
  parts: T[],
  query: string,
  vendor: string | null,
): T[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return parts.filter((p) => {
    if (vendor !== null && p.vendor !== vendor) return false;
    const name = p.name.toLowerCase();
    return words.every((w) => name.includes(w));
  });
}
