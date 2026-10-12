import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Profile from './index';
import API_ENDPOINTS from '../api/config';
import { useGlobalData } from '../globaldatacontext';

jest.mock('../globaldatacontext', () => ({ useGlobalData: jest.fn() }));
const fetchPersonInformation = jest.fn();
const resetPersonInformation = jest.fn();
const renderProfile = (data) => {
  useGlobalData.mockReturnValue({ personInformation: data, personLoading: false, error: null, fetchPersonInformation, resetPersonInformation });
  return render(<MemoryRouter initialEntries={['/people/example']}><Routes><Route path="/people/:slug" element={<Profile />} /></Routes></MemoryRouter>);
};

test('renders arbitrary social platforms and research outputs, excluding unsafe URLs', () => {
  renderProfile({ full_name: 'Example Researcher', social_links: [
    { name: 'ORCID', url: 'https://orcid.org/example' },
    { name: 'New Research Network', url: 'https://example.com/profile' },
    { name: 'Unsafe', url: 'javascript:alert(1)' },
  ], research_links: [
    { id: 1, category: 'publication', title: 'Cancer research', url: 'https://example.com/paper', authors: 'Example Researcher', venue: 'Research Journal', date: '2026-10-12' },
    { id: 2, category: 'poster', title: 'Unsafe output', url: 'javascript:alert(1)' },
  ] });
  expect(screen.getByRole('link', { name: 'ORCID' })).toHaveAttribute('href', 'https://orcid.org/example');
  expect(screen.getByRole('link', { name: 'New Research Network' })).toHaveAttribute('rel', 'noopener noreferrer');
  fireEvent.click(screen.getByRole('button', { name: /Publications/ }));
  expect(screen.getByRole('link', { name: /Cancer research/ })).toHaveAttribute('href', 'https://example.com/paper');
  expect(screen.queryByText('Unsafe')).not.toBeInTheDocument();
  expect(screen.queryByText('Unsafe output')).not.toBeInTheDocument();
});

test('omits empty links and outputs while supporting minimal profiles', () => {
  renderProfile({ full_name: 'Minimal Profile' });
  expect(screen.getByRole('heading', { name: 'Minimal Profile' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Find me online' })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /Publications/ })).not.toBeInTheDocument();
});

test('loads relative profile photos from the API server', () => {
  renderProfile({ full_name: 'Photo Profile', image: '/media/people/photo.jpg' });
  const image = screen.getByRole('img', { name: 'Photo Profile' });
  expect(new URL(image.src).pathname).toBe('/media/people/photo.jpg');
  expect(new URL(image.src).origin).toBe(new URL(API_ENDPOINTS.PEOPLE).origin);
});

test('uses the directory photo when the profile photo is missing', () => {
  useGlobalData.mockReturnValue({
    people: [{ slug: 'example', image: 'https://example.com/portrait.jpg' }],
    personInformation: { full_name: 'Directory Photo' }, personLoading: false, error: null,
    fetchPersonInformation, resetPersonInformation,
  });
  render(<MemoryRouter initialEntries={['/people/example']}><Routes><Route path="/people/:slug" element={<Profile />} /></Routes></MemoryRouter>);
  expect(screen.getByRole('img', { name: 'Directory Photo' })).toHaveAttribute('src', 'https://example.com/portrait.jpg');
});
