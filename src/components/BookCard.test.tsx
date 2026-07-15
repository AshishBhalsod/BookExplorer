import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from './BookCard';
import { FavoriteFlowProvider } from '../context/FavoriteFlowContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { ToastProvider } from '../context/ToastContext';
import type { Book } from '../types/book';

const mockBook: Book = {
  id: 'book-1',
  volumeInfo: {
    title: 'Test Book',
    authors: ['Ada Lovelace'],
    description: 'A pioneering work on computing.',
    imageLinks: {
      thumbnail: 'https://example.com/cover.jpg',
    },
  },
};

function renderCard() {
  return render(
    <FavoritesProvider>
      <ToastProvider>
        <MemoryRouter>
          <FavoriteFlowProvider>
            <BookCard book={mockBook} />
          </FavoriteFlowProvider>
        </MemoryRouter>
      </ToastProvider>
    </FavoritesProvider>,
  );
}

describe('Favorites functionality', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a book through the favorite popup and removes with confirm', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('button', { name: /add test book to favorites/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /save favorite/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /remove test book from favorites/i }),
      ).toBeInTheDocument();
    });

    const stored = JSON.parse(localStorage.getItem('book-explorer-favorites') ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('book-1');

    await user.click(screen.getByRole('button', { name: /remove test book from favorites/i }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^remove$/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /add test book to favorites/i }),
      ).toBeInTheDocument();
    });

    const afterRemove = JSON.parse(localStorage.getItem('book-explorer-favorites') ?? '[]');
    expect(afterRemove).toHaveLength(0);
  });
});
