/**
 * Reusable brand-kit assets — content pieces, people, metrics, and images.
 * Import this (or fetch assets/catalog.json) when composing LinkedIn posts,
 * decks, or other materials.
 */

const CATALOG_URL = new URL("../assets/catalog.json?v=1", import.meta.url);

let cached = null;

export async function loadAssetsCatalog() {
  if (cached) return cached;
  const res = await fetch(CATALOG_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Could not load assets catalog (${res.status})`);
  cached = await res.json();
  return cached;
}

export function getPiece(catalog, id) {
  return (catalog?.pieces ?? []).find((piece) => piece.id === id) ?? null;
}

export function getPerson(catalog, id) {
  return (catalog?.people ?? []).find((person) => person.id === id) ?? null;
}

export function getPeopleSet(catalog, id) {
  const set = (catalog?.peopleSets ?? []).find((entry) => entry.id === id);
  if (!set) return null;
  const people = (set.personIds ?? [])
    .map((personId) => getPerson(catalog, personId))
    .filter(Boolean);
  return { ...set, people };
}

export function imagesByGroup(catalog) {
  const groups = new Map();
  for (const image of catalog?.images ?? []) {
    const key = image.group || "other";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(image);
  }
  return groups;
}
