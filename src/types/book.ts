export interface BookVolumeInfo {
  title?: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
  };
  categories?: string[];
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  averageRating?: number;
  ratingsCount?: number;
  language?: string;
  previewLink?: string;
  infoLink?: string;
}

export interface Book {
  id: string;
  volumeInfo: BookVolumeInfo;
}

export interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items?: Book[];
}

export interface SearchParams {
  title: string;
  author: string;
  genre: string;
}

export interface FavoriteBook extends Book {
  notes?: string;
  tags?: string[];
  favoritedAt: string;
}
