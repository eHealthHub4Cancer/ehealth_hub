import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import People from './People';
import { useGlobalData } from './globaldatacontext';
jest.mock('./globaldatacontext', () => ({ useGlobalData: jest.fn() }));

const originalMatchMedia = window.matchMedia;
afterEach(() => { window.matchMedia = originalMatchMedia; });
function setup(mobile) {
  window.matchMedia = jest.fn(() => ({ matches: mobile, addEventListener: jest.fn(), removeEventListener: jest.fn() }));
  useGlobalData.mockReturnValue({ people: Array.from({ length: 45 }, (_, i) => ({ slug: `person-${i}`, full_name: `Person ${i}`, full_title_name: `Person ${i}`, tags: [`Category ${i % 8}`] })), peopleLoading: false, refreshCache: jest.fn(), preloadVisiblePeople: jest.fn() });
  render(<MemoryRouter><People /></MemoryRouter>);
}
test('mobile starts with ten people and expands by ten', () => {
  setup(true);
  expect(screen.getAllByRole('link')).toHaveLength(10);
  fireEvent.click(screen.getByRole('button', { name: 'Load more (10)' }));
  expect(screen.getAllByRole('link')).toHaveLength(20);
});
test('desktop starts with twenty and shows the actual final batch count', () => {
  setup(false);
  expect(screen.getAllByRole('link')).toHaveLength(20);
  fireEvent.click(screen.getByRole('button', { name: 'Load more (20)' }));
  expect(screen.getAllByRole('link')).toHaveLength(40);
  fireEvent.click(screen.getByRole('button', { name: 'Load more (5)' }));
  expect(screen.getAllByRole('link')).toHaveLength(45);
  expect(document.querySelector('.load-more-button')).toBeNull();
});

test('loading badges automatically selects them and deselection stays visible', () => {
  setup(false);
  fireEvent.click(screen.getByText('Choose filter badges'));
  fireEvent.click(screen.getByLabelText('Select all'));
  fireEvent.click(screen.getByLabelText('Category 7'));
  expect(screen.getAllByRole('button', { name: /Category/ })).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Load more filter badges (5)' }));
  expect(screen.getAllByRole('button', { name: /Category/ })).toHaveLength(6);
  for (let i = 0; i < 5; i++) {
    expect(screen.getByLabelText(`Category ${i}`)).toBeChecked();
    expect(screen.getByRole('button', { name: new RegExp(`Category ${i}`) })).toHaveAttribute('aria-pressed', 'false');
  }
  expect(screen.getAllByRole('link')).toHaveLength(20);
  fireEvent.click(screen.getByLabelText('Category 0'));
  expect(screen.getByLabelText('Category 0')).not.toBeChecked();
  expect(screen.queryByRole('button', { name: /Category 0/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('Select all'));
  for (let i = 0; i < 8; i++) expect(screen.getByLabelText(`Category ${i}`)).toBeChecked();
  expect(screen.queryByRole('button', { name: /Load more filter badges/ })).not.toBeInTheDocument();
});

test('badge picker closes outside and on Escape, but stays open inside', () => {
  setup(false);
  const summary = screen.getByText('Choose filter badges');
  const picker = summary.closest('details');
  fireEvent.click(summary);
  expect(picker).toHaveAttribute('open');
  fireEvent.pointerDown(screen.getByLabelText('Category 0'));
  expect(picker).toHaveAttribute('open');
  fireEvent.pointerDown(screen.getByRole('heading', { name: 'People' }));
  expect(picker).not.toHaveAttribute('open');
  fireEvent.click(summary);
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(picker).not.toHaveAttribute('open');
});

test('deselecting a dropdown option removes its badge and active people filter', () => {
  setup(false);
  fireEvent.click(screen.getByRole('button', { name: /Category 0/ }));
  expect(screen.getAllByRole('link').length).toBeLessThan(20);
  fireEvent.click(screen.getByText('Choose filter badges'));
  fireEvent.click(screen.getByLabelText('Category 0'));
  expect(screen.getByLabelText('Category 0')).not.toBeChecked();
  expect(screen.queryByRole('button', { name: /Category 0/ })).not.toBeInTheDocument();
  expect(screen.getAllByRole('link')).toHaveLength(20);
});
