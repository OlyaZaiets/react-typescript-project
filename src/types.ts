export interface VolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  language?: string;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
  infoLink?: string;
  pageCount?: number;
  categories?: string; 
  averageRating?: number;
}

export interface BookItem {
  id: string;
  kind: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
}

export interface BooksApiResponse {
  items?: BookItem[];
  totalItems?: number;
}

export interface BookWithoutCover {
  id: string;
  title: string;
  coverUrl: string;
}
