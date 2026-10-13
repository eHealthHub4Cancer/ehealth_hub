import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PageMetadata from './PageMetadata';
import { routeMetadata, publicPages } from './pages';

const View = ({ path, heading }) => <MemoryRouter initialEntries={[path]}><PageMetadata /><main className="main-content">{heading && <h1>{heading}</h1>}</main></MemoryRouter>;

test('public pages have unique titles and replace generic description', () => {
  expect(new Set(publicPages.map(([, title]) => title)).size).toBe(publicPages.length);
  render(<View path="/people" heading="People" />);
  expect(document.title).toBe('Meet the Team | eHealth Hub for Cancer');
  expect(document.querySelector('meta[name="description"]').content).toContain('researchers');
});
test('dynamic profile title updates after the profile loads', async () => {
  const { rerender } = render(<View path="/people/example" />);
  expect(document.title).toBe('Researcher Profile | eHealth Hub for Cancer');
  rerender(<View path="/people/example" heading="Professor Example" />);
  await waitFor(() => expect(document.title).toBe('Professor Example | eHealth Hub for Cancer'));
});
test('private routes are marked noindex without excluding public profiles', () => {
  render(<View path="/admin/news" heading="Admin" />);
  expect(document.querySelector('meta[name="robots"]').content).toBe('noindex, nofollow');
  expect(routeMetadata('/people/example').private).not.toBe(true);
});
