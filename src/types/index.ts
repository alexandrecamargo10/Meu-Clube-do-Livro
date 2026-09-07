export type Role = 'FREE' | 'PLUS' | 'MASTER';
export type ShelfTheme = 'WOOD' | 'DARK' | 'NEON' | 'VINTAGE';
export type BookType = 'BOOK' | 'MANGA' | 'COMIC';
export type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'READ' | 'ABANDONED';

export interface BookItem {
  id: string;
  externalId?: string;
  title: string;
  authors: string;
  coverUrl: string;
  synopsis?: string;
  pageCount: number;
  publishedYear?: number;
  type: BookType;
  isbn?: string;
  status?: ReadingStatus;
  currentPage?: number;
  rating?: number; // 1 to 5
  notes?: string;
}

export interface ShelfData {
  id: string;
  name: string;
  description?: string;
  theme: ShelfTheme;
  isPublic: boolean;
  userId?: string;
  clubId?: string;
  books: BookItem[];
  createdAt: string;
}

export interface ClubData {
  id: string;
  name: string;
  description: string;
  bannerUrl?: string;
  masterId: string;
  masterName: string;
  memberCount: number;
  currentBook?: BookItem;
  readingDeadline?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: Role;
  bio?: string;
}

export interface BookSearchResult {
  id: string;
  title: string;
  authors: string;
  coverUrl: string;
  synopsis?: string;
  pageCount: number;
  publishedYear?: number;
  type: BookType;
  isbn?: string;
}

export interface SubscriptionPlan {
  id: Role;
  name: string;
  priceMonthly: string;
  priceYearly: string;
  description: string;
  features: string[];
  maxShelves: number | 'Unlimited';
  maxBooksPerShelf: number | 'Unlimited';
  maxClubs: number;
  canCreateClub: boolean;
  exclusiveThemes: boolean;
  highlight?: boolean;
}
