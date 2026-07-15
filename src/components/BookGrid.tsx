import { memo } from 'react';
import type { Book } from '../types/book';
import { BookCard } from './BookCard';
import { EmptyState } from './EmptyState';
import './BookGrid.css';

interface BookGridProps {
  books: Book[];
  emptyTitle?: string;
  emptyMessage?: string;
}

function BookGridComponent({
  books,
  emptyTitle = 'No books found',
  emptyMessage = 'Try a different title, author, or genre.',
}: BookGridProps) {
  if (books.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <ul className="book-grid" aria-label="Book results">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard book={book} />
        </li>
      ))}
    </ul>
  );
}

export const BookGrid = memo(BookGridComponent);
