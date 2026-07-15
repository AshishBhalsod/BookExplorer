import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { EmptyState } from '../components/EmptyState';
import { IconSearch, IconTrash } from '../components/Icons';
import { useFavoriteFlow } from '../context/FavoriteFlowContext';
import { useFavorites } from '../context/FavoritesContext';
import './FavoritesPage.css';

export function FavoritesPage() {
  const { favorites } = useFavorites();
  const { requestRemove } = useFavoriteFlow();

  const sorted = useMemo(
    () =>
      [...favorites].sort(
        (a, b) => new Date(b.favoritedAt).getTime() - new Date(a.favoritedAt).getTime(),
      ),
    [favorites],
  );

  return (
    <main className="favorites-page">
      <header className="favorites-page__header">
        <h1>Your favorites</h1>
        <p>
          {favorites.length === 0
            ? 'Books you save will appear here for quick access.'
            : `You have ${favorites.length} saved ${favorites.length === 1 ? 'book' : 'books'}.`}
        </p>
      </header>

      {sorted.length === 0 ? (
        <div className="favorites-page__empty-wrap">
          <EmptyState
            title="No favorites yet"
            message="Find a book you like and tap Favorite to save it here."
          />
          <Link to="/" className="btn btn--primary favorites-page__cta">
            <IconSearch size={16} />
            Search for books
          </Link>
        </div>
      ) : (
        <ul className="favorites-page__list" aria-label="Favorite books">
          {sorted.map((book) => (
            <li key={book.id} className="favorites-page__item">
              <BookCard book={book} />
              {(book.notes || (book.tags && book.tags.length > 0)) && (
                <div className="favorites-page__meta">
                  {book.notes && (
                    <p>
                      <strong>Notes:</strong> {book.notes}
                    </p>
                  )}
                  {book.tags && book.tags.length > 0 && (
                    <div className="favorites-page__tags">
                      {book.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button
                type="button"
                className="btn btn--danger-ghost btn--sm"
                onClick={() => requestRemove(book)}
                aria-label={`Remove ${book.volumeInfo?.title ?? 'book'} from favorites`}
              >
                <IconTrash size={15} />
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
