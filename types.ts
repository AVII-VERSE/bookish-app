export enum ScreenName {
  SPLASH = 'SPLASH',
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  MARKETPLACE = 'MARKETPLACE',
  BOOK_DETAILS = 'BOOK_DETAILS',
  DASHBOARD = 'DASHBOARD',
  SUBMIT_BOOK = 'SUBMIT_BOOK',
  LIBRARY = 'LIBRARY',
  PROFILE = 'PROFILE',
  NOTIFICATIONS = 'NOTIFICATIONS',
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  price: number;
  rating: number;
  reviews: number;
  description?: string;
  genre?: string;
}

export interface SaleData {
  name: string;
  value: number;
}