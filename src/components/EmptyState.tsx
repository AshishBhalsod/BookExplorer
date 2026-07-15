import { IconBooksEmpty } from './Icons';
import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__visual">
        <IconBooksEmpty />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
    </div>
  );
}
