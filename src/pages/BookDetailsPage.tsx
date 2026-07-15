import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  fetchBookById,
  getBookAuthors,
  getBookTitle,
  getCoverUrl,
} from '../api/books';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { IconArrowLeft, IconExternal, IconHeart } from '../components/Icons';
import { useFavoriteFlow } from '../context/FavoriteFlowContext';
import { useFavorites } from '../context/FavoritesContext';
import type { Book } from '../types/book';
import type { BackPath, BookNavState } from '../types/navigation';
import './BookDetailsPage.css';

export function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { isFavorite } = useFavorites();
  const { requestAdd, requestRemove } = useFavoriteFlow();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const from: BackPath = (location.state as BookNavState | null)?.from === '/favorites' ? '/favorites' : '/';
  const backLabel = from === '/favorites' ? 'Back to favorites' : 'Back to search';

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setIsLoading(true);
    setError('');

    fetchBookById(id)
      .then((data) => {
        if (!cancelled) setBook(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load book.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <main className="details-page">
        <LoadingSpinner label="Loading book details…" />
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="details-page">
        <p className="details-page__error" role="alert">
          {error || 'Book not found.'}
        </p>
        <Link to={from} className="btn btn--outline">
          <IconArrowLeft size={16} />
          {backLabel}
        </Link>
      </main>
    );
  }

  const favorited = isFavorite(book.id);
  const cover = getCoverUrl(book, 'large');
  const info = book.volumeInfo ?? {};
  const title = getBookTitle(book);
  const authors = getBookAuthors(book);
  const description =
    info.description?.replace(/<[^>]*>/g, '').trim() || 'No description available.';
  const categories = info.categories?.filter(Boolean) ?? [];

  const metaItems = [
    info.publishedDate && { label: 'Published', value: info.publishedDate },
    info.publisher && { label: 'Publisher', value: info.publisher },
    typeof info.pageCount === 'number' && info.pageCount > 0 && {
      label: 'Pages',
      value: String(info.pageCount),
    },
    typeof info.averageRating === 'number' && {
      label: 'Rating',
      value:
        `${info.averageRating} / 5` +
        (typeof info.ratingsCount === 'number' ? ` (${info.ratingsCount})` : ''),
    },
    info.language && { label: 'Language', value: info.language.toUpperCase() },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main className="details-page">
      <Link to={from} className="details-page__back btn btn--outline btn--sm">
        <IconArrowLeft size={16} />
        {backLabel}
      </Link>

      <article className="details-page__layout">
        <div className="details-page__cover-col">
          <div className="details-page__cover">
            {cover ? (
              <img src={cover} alt={`Cover of ${title}`} width={280} height={420} />
            ) : (
              <div className="details-page__placeholder" aria-hidden="true">
                {title.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="details-page__content">
          <div className="details-page__head">
            <h1 className="details-page__title">{title}</h1>
            <p className="details-page__authors">{authors}</p>
          </div>

          {categories.length > 0 && (
            <ul className="details-page__tags" aria-label="Categories">
              {categories.map((category) => (
                <li key={category} className="tag">
                  {category}
                </li>
              ))}
            </ul>
          )}

          {metaItems.length > 0 && (
            <div className="details-page__meta-grid">
              {metaItems.map((item) => (
                <div key={item.label} className="details-page__meta-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          )}

          <section className="details-page__description" aria-labelledby="desc-heading">
            <h2 id="desc-heading">About this book</h2>
            <p>{description}</p>
          </section>

          <div className="details-page__actions">
            <button
              type="button"
              className={`btn ${favorited ? 'btn--accent-solid' : 'btn--primary'}`}
              onClick={() => (favorited ? requestRemove(book) : requestAdd(book))}
              aria-pressed={favorited}
            >
              <IconHeart size={16} filled={favorited} />
              {favorited ? 'Remove from favorites' : 'Add to favorites'}
            </button>
            {info.previewLink && (
              <a
                href={info.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline"
              >
                <IconExternal size={16} />
                Preview
              </a>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
