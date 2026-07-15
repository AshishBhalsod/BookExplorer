import type { Book, GoogleBooksResponse, SearchParams } from '../types/book';
import { GOOGLE_BOOKS_API_KEY } from '../config';

const API_BASE = 'https://www.googleapis.com/books/v1/volumes';

function buildUrl(path: string, params: Record<string, string | number> = {}): string {
  const url = new URL(`${API_BASE}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  if (GOOGLE_BOOKS_API_KEY) {
    url.searchParams.set('key', GOOGLE_BOOKS_API_KEY);
  }

  return url.toString();
}

export function buildSearchQuery({ title, author, genre }: SearchParams): string {
  const parts: string[] = [];

  if (title.trim()) {
    parts.push(`intitle:${title.trim()}`);
  }
  if (author.trim()) {
    parts.push(`inauthor:${author.trim()}`);
  }
  if (genre.trim()) {
    parts.push(`subject:${genre.trim()}`);
  }

  return parts.join('+');
}

export async function searchBooks(
  params: SearchParams,
  maxResults = 12,
  startIndex = 0,
): Promise<{ books: Book[]; totalItems: number }> {
  const query = buildSearchQuery(params);

  if (!query) {
    throw new Error('At least one search field is required.');
  }

  const response = await fetch(
    buildUrl('', { q: query, maxResults, startIndex }),
  );

  if (!response.ok) {
    throw new Error('Failed to fetch books. Please try again.');
  }

  const data: GoogleBooksResponse = await response.json();

  return {
    books: data.items ?? [],
    totalItems: data.totalItems ?? 0,
  };
}

export async function fetchBookById(id: string): Promise<Book> {
  const response = await fetch(buildUrl(`/${id}`));

  if (!response.ok) {
    throw new Error('Book not found.');
  }

  return response.json();
}

export function getCoverUrl(book: Book, size: 'small' | 'large' = 'small'): string | undefined {
  const links = book.volumeInfo?.imageLinks;
  if (!links) return undefined;

  const raw =
    size === 'large'
      ? links.large ?? links.medium ?? links.thumbnail ?? links.smallThumbnail
      : links.thumbnail ?? links.smallThumbnail ?? links.small;

  return raw?.replace('http://', 'https://');
}

export function truncateText(text: string | undefined, maxLength: number): string {
  if (!text) return '';
  const cleaned = text.replace(/<[^>]*>/g, '');
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength).trim()}…`;
}

export function getBookTitle(book: Book): string {
  return book.volumeInfo?.title?.trim() || 'Untitled';
}

export function getBookAuthors(book: Book): string {
  const authors = book.volumeInfo?.authors;
  if (!authors || authors.length === 0) return 'Unknown author';
  return authors.join(', ');
}
