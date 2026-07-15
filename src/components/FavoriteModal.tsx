import { useId, useState, type FormEvent } from 'react';
import { getBookAuthors, getBookTitle, getCoverUrl } from '../api/books';
import type { Book } from '../types/book';
import { Modal } from './ConfirmDialog';
import { IconHeart } from './Icons';
import './FavoriteModal.css';

interface FavoriteModalProps {
  book: Book | null;
  open: boolean;
  onClose: () => void;
  onSave: (notes: string, tags: string[], originEl: HTMLElement | null) => void;
}

export function FavoriteModal({ book, open, onClose, onSave }: FavoriteModalProps) {
  const formId = useId();
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');

  if (!book) return null;

  const title = getBookTitle(book);
  const authors = getBookAuthors(book);
  const cover = getCoverUrl(book);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const origin = document.getElementById(`fav-origin-${book.id}`);
    onSave(notes.trim(), tagList, origin);
    setNotes('');
    setTags('');
  };

  const handleClose = () => {
    setNotes('');
    setTags('');
    onClose();
  };

  return (
    <Modal open={open} title="Add to favorites" onClose={handleClose}>
      <div className="fav-modal__preview">
        {cover ? (
          <img
            id={`fav-origin-${book.id}`}
            src={cover}
            alt=""
            className="fav-modal__cover"
            width={64}
            height={96}
          />
        ) : (
          <div id={`fav-origin-${book.id}`} className="fav-modal__cover fav-modal__cover--empty">
            {title.charAt(0)}
          </div>
        )}
        <div>
          <p className="fav-modal__title">{title}</p>
          <p className="fav-modal__authors">{authors}</p>
        </div>
      </div>

      <form className="fav-modal__form" onSubmit={handleSubmit}>
        <label htmlFor={`${formId}-notes`}>Notes (optional)</label>
        <textarea
          id={`${formId}-notes`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Why you want to save this book"
        />

        <label htmlFor={`${formId}-tags`}>Tags (comma separated)</label>
        <input
          id={`${formId}-tags`}
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="must-read, classic"
        />

        <div className="fav-modal__actions">
          <button type="button" className="btn btn--ghost" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            <IconHeart size={16} filled />
            Save favorite
          </button>
        </div>
      </form>
    </Modal>
  );
}
