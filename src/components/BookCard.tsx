import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getBookAuthors, getBookTitle, getCoverUrl, truncateText } from '../api/books';
import { useFavoriteFlow } from '../context/FavoriteFlowContext';
import { useFavorites } from '../context/FavoritesContext';
import type { Book } from '../types/book';
import type { BackPath, BookNavState } from '../types/navigation';
import { IconBook, IconHeart } from './Icons';
import './BookCard.css';

interface BookCardProps {
  book: Book;
}

function BookCardComponent({ book }: BookCardProps) {
  const location = useLocation();
  const { isFavorite } = useFavorites();
  const { requestAdd, requestRemove } = useFavoriteFlow();
  const favorited = isFavorite(book.id);

  const from: BackPath = location.pathname === '/favorites' ? '/favorites' : '/';
  const navState: BookNavState = { from };

  const title = getBookTitle(book);
  const cover = getCoverUrl(book);
  const authors = getBookAuthors(book);
  const description = truncateText(book.volumeInfo?.description, 100);

  return (
    <article className="book-card">
      <div className="book-card__cover-wrap">
        <Link
          to={`/book/${book.id}`}
          state={navState}
          className="book-card__media"
          aria-label={`View details for ${title}`}
        >
          {cover ? (
            <img src={cover} alt={`Cover of ${title}`} loading="lazy" width={180} height={270} />
          ) : (
            <div className="book-card__placeholder" aria-hidden="true">
              <span>{title.charAt(0)}</span>
            </div>
          )}
        </Link>
        {favorited && <span className="book-card__badge">Saved</span>}
      </div>

      <div className="book-card__body">
        <h3 className="book-card__title">
          <Link to={`/book/${book.id}`} state={navState}>
            {title}
          </Link>
        </h3>
        <p className="book-card__authors">{authors}</p>
        <p className="book-card__desc">{description || 'No description available.'}</p>

        <div className="book-card__actions">
          <Link to={`/book/${book.id}`} state={navState} className="btn btn--outline btn--sm">
            <IconBook size={15} />
            Details
          </Link>
          <button
            type="button"
            className={`btn btn--sm ${favorited ? 'btn--accent-solid' : 'btn--primary'}`}
            onClick={() => (favorited ? requestRemove(book) : requestAdd(book))}
            aria-pressed={favorited}
            aria-label={
              favorited ? `Remove ${title} from favorites` : `Add ${title} to favorites`
            }
          >
            <IconHeart size={15} filled={favorited} />
            {favorited ? 'Saved' : 'Favorite'}
          </button>
        </div>
      </div>
    </article>
  );
}

export const BookCard = memo(BookCardComponent);
