import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FavoriteFlowProvider } from './context/FavoriteFlowContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ScrollChromeProvider } from './context/ScrollChromeContext';
import { SearchProvider } from './context/SearchContext';
import { ToastProvider } from './context/ToastContext';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';

const BookDetailsPage = lazy(() =>
  import('./pages/BookDetailsPage').then((m) => ({ default: m.BookDetailsPage })),
);

function App() {
  return (
    <FavoritesProvider>
      <ToastProvider>
        <SearchProvider>
          <BrowserRouter>
            <FavoriteFlowProvider>
              <ScrollChromeProvider>
                <div className="app-shell">
                  <Navbar />
                  <div className="app-shell__main">
                    <Suspense fallback={<LoadingSpinner label="Loading page…" />}>
                      <Routes>
                        <Route path="/" element={<SearchPage />} />
                        <Route path="/book/:id" element={<BookDetailsPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Suspense>
                  </div>
                  <Footer />
                </div>
              </ScrollChromeProvider>
            </FavoriteFlowProvider>
          </BrowserRouter>
        </SearchProvider>
      </ToastProvider>
    </FavoritesProvider>
  );
}

export default App;
