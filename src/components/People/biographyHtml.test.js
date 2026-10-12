import { biographyHtml } from './biographyHtml';

test('makes institution labels and bold standalone labels semantic headings', () => {
  const div = document.createElement('div');
  div.innerHTML = biographyHtml('<p>Associated Institutions</p><ul><li>University</li></ul><p><strong>Research Focus</strong></p><p>Research description.</p>');
  expect([...div.querySelectorAll('h3')].map(node => node.textContent)).toEqual(['Associated Institutions', 'Research Focus']);
  expect(div.querySelector('p').textContent).toBe('Research description.');
});
test('retains sanitization and keeps bold prose as prose', () => {
  const html = biographyHtml('<p><strong>This is a sentence.</strong></p><h1>Affiliations</h1><script>alert(1)</script>');
  expect(html).toContain('<p><strong>This is a sentence.</strong></p>');
  expect(html).toContain('<h3>Affiliations</h3>');
  expect(html).not.toContain('script');
});
