import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResearchOutputs from './ResearchOutputs';

test('sections and individual details expand independently from external links', () => {
  render(<ResearchOutputs heading="Posters" links={[{ id: 1, title: 'Cancer poster', url: 'https://example.com/poster', authors: 'Research Team', venue: 'Conference' }]} />);
  const heading = screen.getByRole('button', { name: 'Research Outputs 1' });
  expect(heading).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByText('Cancer poster')).not.toBeInTheDocument();
  fireEvent.click(heading);
  expect(screen.queryByText('Research Team')).not.toBeInTheDocument();
  const link = screen.getByRole('link', { name: 'Open Cancer poster in a new tab' });
  expect(link).toHaveAttribute('href', 'https://example.com/poster');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  fireEvent.click(screen.getByRole('button', { name: 'Show details for Cancer poster' }));
  expect(screen.getByText('Research Team')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Hide details for Cancer poster' }));
  expect(screen.queryByText('Research Team')).not.toBeInTheDocument();
  fireEvent.click(heading);
  expect(screen.queryByText('Cancer poster')).not.toBeInTheDocument();
});

test('keeps long collections limited until View all is selected', () => {
  render(<ResearchOutputs heading="Publications" links={Array.from({ length: 9 }, (_, i) => ({ id: i, title: `Paper ${i}`, url: `https://example.com/${i}` }))} />);
  fireEvent.click(screen.getByRole('button', { name: 'Research Outputs 9' }));
  expect(screen.getAllByRole('link')).toHaveLength(7);
  fireEvent.click(screen.getByRole('button', { name: 'View all research outputs (9)' }));
  expect(screen.getAllByRole('link')).toHaveLength(9);
  expect(screen.queryByRole('button', { name: /Show details/ })).not.toBeInTheDocument();
});

test('one outputs card filters by populated categories and identifies every item', () => {
  render(<ResearchOutputs links={[
    { id: 1, category: 'publication', title: 'Research paper', url: 'https://example.com/paper' },
    { id: 2, category: 'poster', title: 'Conference poster', url: 'https://example.com/poster' },
  ]} />);
  fireEvent.click(screen.getByRole('button', { name: 'Research Outputs 2' }));
  expect(screen.queryByRole('button', { name: /^All/ })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Presentations/ })).not.toBeInTheDocument();
  expect(screen.getByText('Publication')).toBeInTheDocument();
  expect(screen.getByText('Research paper')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Posters 1' }));
  expect(screen.getByText('Poster')).toBeInTheDocument();
  expect(screen.getByText('Conference poster')).toBeInTheDocument();
  expect(screen.getByText('Research paper')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Publications 1' }));
  expect(screen.queryByText('Research paper')).not.toBeInTheDocument();
  expect(screen.getByText('Conference poster')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Posters 1' }));
  expect(screen.getByText('Select a category above to view research outputs.')).toBeInTheDocument();
});
