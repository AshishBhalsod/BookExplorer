import { BookGrid } from '../components/BookGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Pagination } from '../components/Pagination';
import { SearchForm } from '../components/SearchForm';
import { useSearch } from '../context/SearchContext';
import './SearchPage.css';

export function SearchPage() {
  const {
    params,
    books,
    availableTotal,
    page,
    pageSize,
    totalPages,
    hasSearched,
    isLoading,
    error,
    runSearch,
    goToPage,
  } = useSearch();

  const start = availableTotal === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, availableTotal);

  const handlePageChange = async (nextPage: number) => {
    await goToPage(nextPage);
    document.getElementById('results-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="search-page">
      <section className="search-page__hero" aria-labelledby="search-heading">
        <div className="search-page__hero-glow" aria-hidden="true" />
        <div className="search-page__hero-content">
          <p className="search-page__eyebrow">Your personal reading companion</p>
          <h1 id="search-heading" className="search-page__title">
            Find your next
            <span> great read</span>
          </h1>
          <p className="search-page__lead">
            Search millions of titles by name, author, or genre. Save favorites and pick up right where you left off.
          </p>
        </div>
        <div className="search-page__form-shell">
          <SearchForm onSearch={runSearch} isLoading={isLoading} initialValues={params} />
        </div>
      </section>

      <section className="search-page__results" aria-labelledby="results-heading" aria-live="polite">
        <div className="search-page__results-head">
          <div>
            <h2 id="results-heading">{hasSearched ? 'Search results' : 'Start exploring'}</h2>
            {hasSearched && !isLoading && !error && availableTotal > 0 && (
              <p className="search-page__count">
                Showing {availableTotal.toLocaleString()} available{' '}
                {availableTotal === 1 ? 'book' : 'books'}
              </p>
            )}
          </div>
          {hasSearched && !isLoading && !error && availableTotal > 0 && totalPages > 1 && (
            <span className="search-page__page-badge">Page {page} / {totalPages}</span>
          )}
        </div>

        {isLoading && <LoadingSpinner label="Fetching books…" />}

        {!isLoading && error && (
          <p className="search-page__error" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && hasSearched && (
          <>
            <BookGrid
              books={books}
              emptyTitle="No books found"
              emptyMessage="Nothing matched your search. Try another title, author, or genre."
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              start={start}
              end={end}
              totalItems={availableTotal}
              onChange={handlePageChange}
              disabled={isLoading}
            />
          </>
        )}

        {!isLoading && !hasSearched && (
          <div className="search-page__hint">
            <p>Start with a title, author, or genre above.</p>
            <span>Your results stay here when you browse details or favorites.</span>
          </div>
        )}
      </section>
    </main>
  );
}
