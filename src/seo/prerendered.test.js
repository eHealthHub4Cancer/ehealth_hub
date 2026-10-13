import React from 'react';
import { render, screen } from '@testing-library/react';

// Separate module load so the helper reads the pre-rendered shell set up below.
test('keeps the opened page\'s pre-rendered text without the page-links nav', () => {
  window.history.replaceState(null, '', '/news/example/');
  document.body.innerHTML = '<div id="root"><main class="seo-loading-shell"><h1>Example title</h1><p>Body text</p><nav><a href="/">Home</a></nav></main></div>';
  jest.isolateModules(() => {
    const { prerenderedHtml } = require('./prerendered');
    expect(prerenderedHtml('/news/example')).toBe('<h1>Example title</h1><p>Body text</p>');
    expect(prerenderedHtml('/news/other/')).toBeNull();
  });
  window.history.replaceState(null, '', '/');
});

test('renders saved content', () => {
  const { PrerenderedContent } = require('./prerendered');
  render(<PrerenderedContent html="<h1>Saved</h1>" />);
  expect(screen.getByRole('heading', { name: 'Saved' })).toBeInTheDocument();
});
