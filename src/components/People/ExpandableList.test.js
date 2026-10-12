import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpandableList from './ExpandableList';

test('limits a long list, expands to the full count, and collapses', () => {
  render(<ExpandableList as="ul" label="research interests" limit={3}>{Array.from({length: 5}, (_, i) => <li key={i}>Interest {i + 1}</li>)}</ExpandableList>);
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
  const button = screen.getByRole('button', { name: 'View all research interests (5)' });
  expect(button).toHaveTextContent('View all (5)');
  expect(button).toHaveAttribute('aria-expanded', 'false');
  expect(document.getElementById(button.getAttribute('aria-controls'))).toBe(screen.getByRole('list'));
  fireEvent.click(button);
  expect(screen.getAllByRole('listitem')).toHaveLength(5);
  expect(button).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Show fewer research interests (5)' }));
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
});

test('does not show a toggle for short lists', () => {
  render(<ExpandableList label="research interests" limit={3}><span>One interest</span></ExpandableList>);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('uses fewer items on mobile and updates when the viewport changes', () => {
  const original = window.matchMedia;
  let change;
  const query = { matches: true, addEventListener: jest.fn((event, listener) => { change = listener; }), removeEventListener: jest.fn() };
  window.matchMedia = jest.fn(() => query);
  const { unmount } = render(<ExpandableList as="ul" label="interests" limit={6} mobileLimit={4}>{Array.from({length: 8}, (_, i) => <li key={i}>Interest {i + 1}</li>)}</ExpandableList>);
  expect(screen.getAllByRole('listitem')).toHaveLength(4);
  expect(screen.getByRole('button')).toHaveTextContent('View all (8)');
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getAllByRole('listitem')).toHaveLength(8);
  fireEvent.click(screen.getByRole('button'));
  // Dispatch through a DOM event so React's testing-library act wrapper flushes the update.
  window.addEventListener('resize', change);
  query.matches = false;
  fireEvent(window, new Event('resize'));
  expect(screen.getAllByRole('listitem')).toHaveLength(6);
  expect(screen.getByRole('button')).toHaveTextContent('View all (8)');
  window.removeEventListener('resize', change);
  unmount();
  expect(query.removeEventListener).toHaveBeenCalledWith('change', change);
  window.matchMedia = original;
});
