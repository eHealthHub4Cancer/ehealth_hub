import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
const original = window.matchMedia;
beforeEach(() => { window.matchMedia = jest.fn(() => ({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() })); });
afterEach(() => { window.matchMedia = original; });
function setup() { render(<MemoryRouter initialEntries={['/people/example']}><Navbar /></MemoryRouter>); fireEvent.click(screen.getByRole('button', { name: 'Open navigation' })); }
test('About Us opens its submenu instead of navigating', () => {
  setup();
  expect(screen.queryByRole('link', { name: 'Meet the Team' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'About Us' }));
  expect(screen.getByRole('link', { name: 'Meet the Team' })).toHaveAttribute('href', '/people');
  expect(screen.getByRole('link', { name: 'About eHealth Hub' })).toHaveAttribute('href', '/about');
  fireEvent.click(screen.getByRole('link', { name: 'Meet the Team' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
test('drawer locks scroll, closes on Escape and restores trigger focus', () => {
  setup();
  expect(screen.getByRole('dialog', { name: 'Navigation' })).toBeInTheDocument();
  expect(document.body.style.overflow).toBe('hidden');
  fireEvent.keyDown(screen.getByRole('button', { name: 'Close menu' }), { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.body.style.overflow).not.toBe('hidden');
  expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveFocus();
});
test('dropdown sections have plain chevrons and only one expands at a time', () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: 'About Us' }));
  fireEvent.click(screen.getByRole('button', { name: 'OHDSI Ireland' }));
  expect(screen.getByRole('button', { name: 'About Us' })).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('link', { name: 'About the Node' })).toHaveAttribute('href', '/ohdsi-ireland');
  expect(screen.getByRole('link', { name: 'Seminar Series' })).toBeInTheDocument();
});

 test('desktop dropdown opens on hover and closes on mouse leave', () => {
  window.matchMedia = jest.fn(() => ({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() }));
  render(<MemoryRouter><Navbar /></MemoryRouter>);
  const button = screen.getByRole('button', { name: 'About Us' });
  fireEvent.mouseEnter(button.closest('li'));
  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('link', { name: 'Meet the Team' })).toBeInTheDocument();
  fireEvent.mouseLeave(button.closest('li'));
  expect(button).toHaveAttribute('aria-expanded', 'false');
});
