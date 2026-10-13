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

test('styles wrapped and standalone lists without boxing nested lists', () => {
  const div = document.createElement('div');
  div.innerHTML = biographyHtml('<h3>Experience</h3><p>Selected roles</p><div><ul style="width:50%"><li><p>Institution</p><ul><li>Department</li></ul></li></ul></div><ol start="3"><li value="5">Publication</li></ol>');
  expect(div.querySelectorAll('.bio-list-panel')).toHaveLength(2);
  expect(div.querySelectorAll('.bio-list-row')).toHaveLength(2);
  expect(div.querySelector('li ul')).not.toHaveClass('bio-list-panel');
  expect(div.querySelector('ul')).not.toHaveAttribute('style');
  expect(div.querySelector('ol')).toHaveAttribute('start', '3');
  expect(div.querySelector('ol li')).toHaveAttribute('value', '5');
});
