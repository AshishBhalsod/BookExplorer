import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getBookTitle, getCoverUrl } from '../api/books';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FavoriteModal } from '../components/FavoriteModal';
import { FlyToFavorite, type FlyPayload } from '../components/FlyToFavorite';
import type { Book } from '../types/book';
import { useFavorites } from './FavoritesContext';
import { useToast } from './ToastContext';

interface FavoriteFlowValue {
  requestAdd: (book: Book) => void;
  requestRemove: (book: Book) => void;
}

const FavoriteFlowContext = createContext<FavoriteFlowValue | null>(null);

export function FavoriteFlowProvider({ children }: { children: ReactNode }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { showToast } = useToast();

  const [modalBook, setModalBook] = useState<Book | null>(null);
  const [removeBook, setRemoveBook] = useState<Book | null>(null);
  const [fly, setFly] = useState<FlyPayload | null>(null);

  const requestAdd = useCallback(
    (book: Book) => {
      if (isFavorite(book.id)) {
        setRemoveBook(book);
        return;
      }
      setModalBook(book);
    },
    [isFavorite],
  );

  const requestRemove = useCallback((book: Book) => {
    setRemoveBook(book);
  }, []);

  const handleSave = useCallback(
    (notes: string, tags: string[], originEl: HTMLElement | null) => {
      if (!modalBook) return;

      try {
        const ok = addFavorite(modalBook, notes, tags);
        if (!ok) {
          showToast('Could not save favorite. Please try again.', 'error');
          return;
        }
        const from = originEl?.getBoundingClientRect();
        if (from) {
          setFly({
            imageUrl: getCoverUrl(modalBook),
            label: getBookTitle(modalBook),
            from,
          });
        }
        showToast(`"${getBookTitle(modalBook)}" saved to favorites`, 'success');
        setModalBook(null);
      } catch {
        showToast('Could not save favorite. Please try again.', 'error');
      }
    },
    [modalBook, addFavorite, showToast],
  );

  const handleConfirmRemove = useCallback(() => {
    if (!removeBook) return;
    const title = getBookTitle(removeBook);

    try {
      const ok = removeFavorite(removeBook.id);
      if (ok) {
        showToast(`"${title}" removed from favorites`, 'success');
      } else {
        showToast('Could not remove favorite.', 'error');
      }
    } catch {
      showToast('Could not remove favorite.', 'error');
    } finally {
      setRemoveBook(null);
    }
  }, [removeBook, removeFavorite, showToast]);

  const value = useMemo(
    () => ({ requestAdd, requestRemove }),
    [requestAdd, requestRemove],
  );

  return (
    <FavoriteFlowContext.Provider value={value}>
      {children}

      <FavoriteModal
        book={modalBook}
        open={Boolean(modalBook)}
        onClose={() => setModalBook(null)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(removeBook)}
        title="Remove favorite?"
        message={`Are you sure you want to remove "${removeBook ? getBookTitle(removeBook) : ''}" from favorites?`}
        confirmLabel="Remove"
        danger
        onConfirm={handleConfirmRemove}
        onCancel={() => setRemoveBook(null)}
      />

      <FlyToFavorite payload={fly} onDone={() => setFly(null)} />
    </FavoriteFlowContext.Provider>
  );
}

export function useFavoriteFlow() {
  const context = useContext(FavoriteFlowContext);
  if (!context) {
    throw new Error('useFavoriteFlow must be used within FavoriteFlowProvider');
  }
  return context;
}
