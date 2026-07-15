# Book Explorer

React app to search books with the Google Books API, open book details, and save favorites.

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

```bash
npm run build
npm test
```

## API key

Google Books API key lives in one file: `src/config.ts`

```ts
export const GOOGLE_BOOKS_API_KEY = 'your-key-here';
```

Change or clear that value whenever you need. All requests (`search` and `book/:id`) read the key from there and pass it as the `key` query param.

## Routes

- `/` — search
- `/book/:id` — book details
- `/favorites` — saved books

## How it works

- **Search form** — controlled inputs; at least one of title / author / genre is required
- **API** — `src/api/books.ts` builds the query (`intitle`, `inauthor`, `subject`) and fetches from Google Books
- **Favorites** — Context API + `localStorage` in `src/context/FavoritesContext.tsx`
- **Details page** — loaded with `React.lazy` so the first page stays lighter

## Project structure

```
src/
  api/          Google Books calls
  components/   UI pieces (form, cards, nav)
  context/      favorites state
  pages/        Search, Details, Favorites
  config.ts     API key
  types/        shared types
```

## Stack

React + TypeScript, Vite, React Router, Vitest / React Testing Library
