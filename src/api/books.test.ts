import { describe, expect, it } from 'vitest';
import { buildSearchQuery, truncateText } from './books';

describe('buildSearchQuery', () => {
  it('builds advanced Google Books query operators', () => {
    expect(
      buildSearchQuery({ title: 'Dune', author: 'Herbert', genre: 'fiction' }),
    ).toBe('intitle:Dune+inauthor:Herbert+subject:fiction');
  });

  it('omits empty fields', () => {
    expect(buildSearchQuery({ title: '', author: 'Tolkien', genre: '' })).toBe(
      'inauthor:Tolkien',
    );
  });
});

describe('truncateText', () => {
  it('strips HTML and truncates long text', () => {
    expect(truncateText('<p>Hello world from a long description</p>', 12)).toBe(
      'Hello world…',
    );
  });
});
