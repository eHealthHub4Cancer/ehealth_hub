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
  useGlobalData.mockReturnValue({ people: Array.from({ length: 45 }, (_, i) => ({ slug: `person-${i}`, full_name: `Person ${i}`, full_title_name: `Person ${i}` })), peopleLoading: false, refreshCache: jest.fn(), preloadVisiblePeople: jest.fn() });
  render(<MemoryRouter><People /></MemoryRouter>);
}
test('mobile starts with ten people and expands by ten', () => {
  setup(true);
  expect(screen.getAllByRole('link')).toHaveLength(10);
  fireEvent.click(screen.getByRole('button', { name: 'View more (10)' }));
  expect(screen.getAllByRole('link')).toHaveLength(20);
});
test('desktop starts with twenty and shows the actual final batch count', () => {
  setup(false);
  expect(screen.getAllByRole('link')).toHaveLength(20);
  fireEvent.click(screen.getByRole('button', { name: 'View more (20)' }));
  expect(screen.getAllByRole('link')).toHaveLength(40);
  fireEvent.click(screen.getByRole('button', { name: 'View more (5)' }));
  expect(screen.getAllByRole('link')).toHaveLength(45);
  expect(screen.queryByRole('button', { name: /View more/ })).not.toBeInTheDocument();
});
