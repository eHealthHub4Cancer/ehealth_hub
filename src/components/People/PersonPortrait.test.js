import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PersonPortrait, { getInitials } from './PersonPortrait';

test('uses name initials when no photo is supplied', () => {
  render(<PersonPortrait person={{ full_name: 'David Akwuru' }} />);
  expect(screen.getByRole('img', { name: 'Initials for David Akwuru' })).toHaveTextContent('DA');
  expect(document.querySelector('img')).toBeNull();
});

test('switches to initials on image failure and shows a replacement photo', () => {
  const { rerender } = render(<PersonPortrait person={{ full_name: 'David Akwuru', image: 'https://example.com/photo.jpg' }} />);
  fireEvent.error(screen.getByRole('img', { name: 'David Akwuru' }));
  expect(screen.getByRole('img', { name: 'Initials for David Akwuru' })).toHaveTextContent('DA');
  rerender(<PersonPortrait person={{ full_name: 'David Akwuru', image: 'https://example.com/new.jpg' }} />);
  expect(screen.getByRole('img', { name: 'David Akwuru' })).toHaveAttribute('src', 'https://example.com/new.jpg');
});

test('initials handle titles, single names and absent names', () => {
  expect(getInitials('Prof. Dr. Aedin Culhane')).toBe('AC');
  expect(getInitials('Aedin')).toBe('A');
  expect(getInitials('')).toBe('?');
});

test('uses neutral initials instead of generated coloured sample avatar images', () => {
  render(<PersonPortrait person={{ full_name: 'Elena Petrova', image: '/media/people_images/samples/sample-elena-petrova.png' }} />);
  expect(screen.getByRole('img', { name: 'Initials for Elena Petrova' })).toHaveTextContent('EP');
  expect(document.querySelector('img')).toBeNull();
});
