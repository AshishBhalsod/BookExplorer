import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Book, FavoriteBook } from '../types/book';

const STORAGE_KEY = 'book-explorer-favorites';

interface FavoritesContextValue {
  favorites: FavoriteBook[];
  isFavorite: (id: string) => boolean;
  addFavorite: (book: Book, notes?: string, tags?: string[]) => boolean;
  removeFavorite: (id: string) => boolean;
  updateFavoriteMeta: (id: string, notes: string, tags: string[]) => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function loadFavorites(): FavoriteBook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FavoriteBook[];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteBook[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((book) => book.id === id),
    [favorites],
  );

  const addFavorite = useCallback((book: Book, notes = '', tags: string[] = []) => {
    let added = false;
    setFavorites((prev) => {
      if (prev.some((f) => f.id === book.id)) return prev;
      added = true;
      return [
        ...prev,
        {
          ...book,
          notes,
          tags,
          favoritedAt: new Date().toISOString(),
        },
      ];
    });
    return added;
  }, []);

  const removeFavorite = useCallback((id: string) => {
    let removed = false;
    setFavorites((prev) => {
      if (!prev.some((book) => book.id === id)) return prev;
      removed = true;
      return prev.filter((book) => book.id !== id);
    });
    return removed;
  }, []);

  const updateFavoriteMeta = useCallback((id: string, notes: string, tags: string[]) => {
    setFavorites((prev) =>
      prev.map((book) => (book.id === id ? { ...book, notes, tags } : book)),
    );
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      addFavorite,
      removeFavorite,
      updateFavoriteMeta,
      favoritesCount: favorites.length,
    }),
    [favorites, isFavorite, addFavorite, removeFavorite, updateFavoriteMeta],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
