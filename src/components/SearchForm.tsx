import { useId, useState, type FormEvent } from 'react';
import type { SearchParams } from '../types/book';
import { IconSearch } from './Icons';
import './SearchForm.css';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
  initialValues?: SearchParams;
}

const EMPTY: SearchParams = { title: '', author: '', genre: '' };

export function SearchForm({ onSearch, isLoading = false, initialValues = EMPTY }: SearchFormProps) {
  const formId = useId();
  const [title, setTitle] = useState(initialValues.title);
  const [author, setAuthor] = useState(initialValues.author);
  const [genre, setGenre] = useState(initialValues.genre);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() && !author.trim() && !genre.trim()) {
      setError('Please fill in at least one field to search.');
      return;
    }

    setError('');
    onSearch({ title, author, genre });
  };

  return (
    <form
      className="search-form"
      onSubmit={handleSubmit}
      noValidate
      aria-describedby={error ? `${formId}-error` : undefined}
    >
      <div className="search-form__fields">
        <div className="search-form__field">
          <label htmlFor={`${formId}-title`}>Title</label>
          <input
            id={`${formId}-title`}
            type="text"
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. The Great Gatsby"
            autoComplete="off"
            aria-invalid={Boolean(error)}
          />
        </div>

        <div className="search-form__field">
          <label htmlFor={`${formId}-author`}>Author</label>
          <input
            id={`${formId}-author`}
            type="text"
            name="author"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. F. Scott Fitzgerald"
            autoComplete="off"
            aria-invalid={Boolean(error)}
          />
        </div>

        <div className="search-form__field">
          <label htmlFor={`${formId}-genre`}>Genre / Keyword</label>
          <input
            id={`${formId}-genre`}
            type="text"
            name="genre"
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. fiction, history"
            autoComplete="off"
            aria-invalid={Boolean(error)}
          />
        </div>
      </div>

      {error && (
        <p id={`${formId}-error`} className="search-form__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--primary search-form__submit" disabled={isLoading}>
        <IconSearch size={16} />
        {isLoading ? 'Searching…' : 'Search books'}
      </button>
    </form>
  );
}
