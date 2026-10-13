export function legacyRoute(hash) {
  if (!hash.startsWith('#/') || hash.startsWith('#//')) return null;
  return hash.slice(1);
}
