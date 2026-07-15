import { memo, useMemo } from 'react';
import './Pagination.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  start: number;
  end: number;
  totalItems: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

function buildPages(page: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (let i = page - 1; i <= page + 1; i += 1) {
    if (i >= 1 && i <= totalPages) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | '…')[] = [];

  sorted.forEach((n, index) => {
    if (index > 0 && n - sorted[index - 1] > 1) {
      result.push('…');
    }
    result.push(n);
  });

  return result;
}

function PaginationComponent({
  page,
  totalPages,
  start,
  end,
  totalItems,
  onChange,
  disabled = false,
}: PaginationProps) {
  const items = useMemo(() => buildPages(page, totalPages), [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrap">
      <div className="pagination-info">
        <span className="pagination-info__pill">Page {page} of {totalPages}</span>
        <span className="pagination-info__text">
          Showing <strong>{start}–{end}</strong> of <strong>{totalItems.toLocaleString()}</strong> books
        </span>
      </div>

      <nav className="pagination" aria-label="Search results pages">
        <button
          type="button"
          className="pagination__btn"
          disabled={disabled || page <= 1}
          onClick={() => onChange(page - 1)}
        >
          ← Prev
        </button>

        <ul className="pagination__list">
          {items.map((item, index) =>
            item === '…' ? (
              <li key={`ellipsis-${index}`} className="pagination__ellipsis" aria-hidden="true">
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  className={`pagination__page${item === page ? ' pagination__page--active' : ''}`}
                  aria-current={item === page ? 'page' : undefined}
                  disabled={disabled}
                  onClick={() => onChange(item)}
                >
                  {item}
                </button>
              </li>
            ),
          )}
        </ul>

        <button
          type="button"
          className="pagination__btn"
          disabled={disabled || page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Next →
        </button>
      </nav>
    </div>
  );
}

export const Pagination = memo(PaginationComponent);
