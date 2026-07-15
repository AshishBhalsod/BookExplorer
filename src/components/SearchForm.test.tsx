import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm } from '../components/SearchForm';

describe('SearchForm', () => {
  it('shows a validation error when submitted empty', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchForm onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: /search books/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      /please fill in at least one field/i,
    );
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('submits search params when at least one field is filled', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchForm onSearch={onSearch} />);

    await user.type(screen.getByLabelText(/^title$/i), 'Dune');
    await user.type(screen.getByLabelText(/^author$/i), 'Herbert');
    await user.click(screen.getByRole('button', { name: /search books/i }));

    expect(onSearch).toHaveBeenCalledWith({
      title: 'Dune',
      author: 'Herbert',
      genre: '',
    });
  });

  it('clears the error after the user starts typing', async () => {
    const user = userEvent.setup();

    render(<SearchForm onSearch={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /search books/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/genre/i), 'sci');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
