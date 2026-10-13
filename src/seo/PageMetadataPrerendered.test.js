import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PageMetadata from './PageMetadata';

// Separate file: PageMetadata remembers the first page it renders, as on a real page load.
test('pre-rendered article description is kept on the page that was opened', () => {
  document.head.innerHTML = '<meta name="description" content="Specific article summary">';
  render(<MemoryRouter initialEntries={['/news/example/']}><PageMetadata /><main className="main-content" /></MemoryRouter>);
  expect(document.querySelector('meta[name="description"]').content).toBe('Specific article summary');
  expect(document.querySelector('meta[property="og:description"]').content).toBe('Specific article summary');
});
