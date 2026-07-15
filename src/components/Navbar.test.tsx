import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from './Navbar';
import { FavoritesProvider } from '../context/FavoritesContext';

function renderWithRouter(initialPath = '/') {
  return render(
    <FavoritesProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Navbar />
        <Routes>
          <Route path="/" element={<div>Search page content</div>} />
          <Route path="/favorites" element={<div>Favorites page content</div>} />
        </Routes>
      </MemoryRouter>
    </FavoritesProvider>,
  );
}

describe('Routing via Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('navigates between Search and Favorites', async () => {
    const user = userEvent.setup();
    renderWithRouter('/');

    expect(screen.getByText('Search page content')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /favorites/i }));
    expect(screen.getByText('Favorites page content')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /search/i }));
    expect(screen.getByText('Search page content')).toBeInTheDocument();
  });
});
