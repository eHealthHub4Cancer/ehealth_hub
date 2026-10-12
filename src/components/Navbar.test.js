import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

test('dropdown buttons expose their state and preserve the OHDSI page link', () => {
  render(<MemoryRouter><Navbar /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'OHDSI Ireland' })).toHaveAttribute('href', '/ohdsi-ireland');
  const ohdsi = screen.getByRole('button', { name: 'OHDSI Ireland submenu' });
  const output = screen.getByRole('button', { name: 'Output' });
  expect(ohdsi).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(ohdsi);
  expect(ohdsi).toHaveAttribute('aria-expanded', 'true');
  expect(document.getElementById(ohdsi.getAttribute('aria-controls'))).toHaveClass('show');
  fireEvent.click(output);
  expect(output).toHaveAttribute('aria-expanded', 'true');
  expect(ohdsi).toHaveAttribute('aria-expanded', 'false');
  fireEvent.keyDown(output, { key: 'Escape' });
  expect(output).toHaveAttribute('aria-expanded', 'false');
});

test('mobile navigation closes when a submenu destination is selected', () => {
  render(<MemoryRouter><Navbar /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  fireEvent.click(screen.getByRole('button', { name: 'OHDSI Ireland submenu' }));
  fireEvent.click(screen.getByRole('link', { name: 'Seminar Series' }));
  expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('button', { name: 'OHDSI Ireland submenu' })).toHaveAttribute('aria-expanded', 'false');
});

test('groups People under About Us and closes the submenu after navigation', () => {
  render(<MemoryRouter initialEntries={['/people/example']}><Navbar /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'About Us' })).toHaveClass('active');
  const toggle = screen.getByRole('button', { name: 'About Us submenu' });
  fireEvent.click(toggle);
  const people = screen.getByRole('link', { name: 'Meet the Team' });
  expect(people.closest('ul')).toHaveAttribute('id', 'about-submenu');
  expect(people).toHaveAttribute('href', '/people');
  fireEvent.click(people);
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
