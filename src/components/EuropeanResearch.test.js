import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EuropeanResearch from './EuropeanResearch';

test('links the EU health data articles and OHDSI Ireland', () => {
  render(<MemoryRouter><EuropeanResearch /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: /University of Limerick/ })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /European Health Data Space \(EHDS\)/ })).toHaveAttribute('href', '/news/preparing-for-EHDS');
  expect(screen.getByRole('link', { name: /CANDLE/ })).toHaveAttribute('href', '/news/ul-leads-ireland-in-eu-candle-cancer-data-project');
  expect(screen.getByRole('link', { name: /OHDSI Ireland/ })).toHaveAttribute('href', '/ohdsi-ireland');
});
