import { legacyRoute } from './legacyRoutes';

test('preserves old shared profile links and query parameters', () => {
  expect(legacyRoute('#/people/aedin-culhane')).toBe('/people/aedin-culhane');
  expect(legacyRoute('#/blog/article?ref=email')).toBe('/blog/article?ref=email');
});
test('does not reinterpret anchor fragments or external-looking paths', () => {
  expect(legacyRoute('#research')).toBeNull();
  expect(legacyRoute('#//example.com')).toBeNull();
  expect(legacyRoute('')).toBeNull();
});
