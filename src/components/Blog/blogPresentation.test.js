import { blogPreview, authorNames, authorInitials } from './blogPresentation';

test('previews HTML and Markdown as readable text with decoded entities', () => {
  expect(blogPreview('<p>Hello <strong>world</strong> &amp; research.</p><p>Next paragraph.</p>')).toBe('Hello world & research. Next paragraph.');
  expect(blogPreview('## Heading\n\n**Research** [link](https://example.com)')).toBe('Heading Research link');
  expect(blogPreview('<p>Safe</p><script>alert(1)</script>')).toBe('Safe');
});
test('handles absent content and truncates cleanly', () => {
  expect(blogPreview(null)).toBe('No preview available');
  expect(blogPreview('<p>Long content</p>', 4)).toBe('Long…');
});
test('creates initials for each named author', () => {
  expect(authorNames('Dr. Aedin Culhane & Ruth Clifford')).toEqual(['Dr. Aedin Culhane', 'Ruth Clifford']);
  expect(authorInitials('Dr. Aedin Culhane')).toBe('AC');
  expect(authorInitials('Ruth Clifford')).toBe('RC');
});
