import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { searchBooks } from '../api/books';
import { MAX_FETCHABLE, PAGE_SIZE } from '../constants';
import type { Book, SearchParams } from '../types/book';

const EMPTY_PARAMS: SearchParams = { title: '', author: '', genre: '' };

interface SearchContextValue {
  params: SearchParams;
  books: Book[];
  totalItems: number;
  availableTotal: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasSearched: boolean;
  isLoading: boolean;
  error: string;
  runSearch: (params: SearchParams) => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

const SearchContext = createContext<SearchContextValue | null>(null);

function getTotalPages(availableTotal: number, pageSize: number) {
  if (availableTotal <= 0) return 1;
  return Math.max(1, Math.ceil(availableTotal / pageSize));
}

function capAvailable(totalItems: number, booksOnPage: number, startIndex: number) {
  const reported = Math.min(Math.max(0, totalItems), MAX_FETCHABLE);

  if (booksOnPage === 0) {
    return Math.min(reported, startIndex);
  }

  if (booksOnPage < PAGE_SIZE) {
    return Math.min(reported, startIndex + booksOnPage);
  }

  return Math.max(reported, Math.min(startIndex + booksOnPage, MAX_FETCHABLE));
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useState<SearchParams>(EMPTY_PARAMS);
  const [books, setBooks] = useState<Book[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [availableTotal, setAvailableTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPage = useCallback(async (searchParams: SearchParams, nextPage: number) => {
    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const startIndex = (nextPage - 1) * PAGE_SIZE;
      const result = await searchBooks(searchParams, PAGE_SIZE, startIndex);

      if (result.books.length === 0 && nextPage > 1) {
        const fallbackPage = nextPage - 1;
        const fallbackStart = (fallbackPage - 1) * PAGE_SIZE;
        const fallback = await searchBooks(searchParams, PAGE_SIZE, fallbackStart);
        const capped = Math.min(
          fallbackStart + fallback.books.length,
          MAX_FETCHABLE,
          result.totalItems || fallback.totalItems,
        );

        setBooks(fallback.books);
        setTotalItems(result.totalItems || fallback.totalItems);
        setAvailableTotal(Math.max(capped, fallback.books.length));
        setPage(fallbackPage);
        setParams(searchParams);
        return;
      }

      const capped = capAvailable(result.totalItems, result.books.length, startIndex);

      setBooks(result.books);
      setTotalItems(result.totalItems);
      setAvailableTotal(capped);
      setPage(nextPage);
      setParams(searchParams);
    } catch (err) {
      setBooks([]);
      setTotalItems(0);
      setAvailableTotal(0);
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runSearch = useCallback(
    async (searchParams: SearchParams) => {
      await fetchPage(searchParams, 1);
    },
    [fetchPage],
  );

  const goToPage = useCallback(
    async (nextPage: number) => {
      const maxPage = getTotalPages(availableTotal || 1, PAGE_SIZE);
      const safePage = Math.min(Math.max(1, nextPage), maxPage);
      await fetchPage(params, safePage);
    },
    [fetchPage, params, availableTotal],
  );

  const value = useMemo(
    () => ({
      params,
      books,
      totalItems,
      availableTotal,
      page,
      pageSize: PAGE_SIZE,
      totalPages: hasSearched ? getTotalPages(availableTotal, PAGE_SIZE) : 1,
      hasSearched,
      isLoading,
      error,
      runSearch,
      goToPage,
    }),
    [
      params,
      books,
      totalItems,
      availableTotal,
      page,
      hasSearched,
      isLoading,
      error,
      runSearch,
      goToPage,
    ],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}
