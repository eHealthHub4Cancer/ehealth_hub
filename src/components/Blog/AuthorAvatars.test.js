import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthorAvatars from './AuthorAvatars';

test('shows first author, expands others, and does not navigate the enclosing card', () => {
  const navigate = jest.fn();
  render(<div onClick={navigate}><AuthorAvatars authors="Aedin Culhane, Ruth Clifford, David Akwuru" /></div>);
  expect(screen.getByText('Aedin Culhane')).toBeInTheDocument();
  expect(screen.queryByText('Ruth Clifford')).not.toBeInTheDocument();
  const toggle = screen.getByRole('button', { name: /Other authors \(2\)/ });
  fireEvent.click(toggle);
  expect(screen.getByText('Ruth Clifford')).toBeInTheDocument();
  expect(screen.getByText('RC')).toBeInTheDocument();
  expect(navigate).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: /Hide other authors/ }));
  expect(screen.queryByText('Ruth Clifford')).not.toBeInTheDocument();
});

test('single authors do not get a disclosure control', () => {
  render(<AuthorAvatars authors="Ruth Clifford" />);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('article view shows all authors without a disclosure control', () => {
  render(<AuthorAvatars authors="Aedin Culhane, Ruth Clifford" showAll />);
  expect(screen.getByText('Aedin Culhane')).toBeInTheDocument();
  expect(screen.getByText('Ruth Clifford')).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
