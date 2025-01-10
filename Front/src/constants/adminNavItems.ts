// src/constants/AdminNavItems.ts

export interface NavItem {
  path: string;
  label: string;
}

export const navItems: NavItem[] = [
  { path: '/admin/ingredients', label: '식재료' },
  { path: '/admin/users', label: '유저' },
  { path: '/admin/categories', label: '카테고리' },
  { path: '/admin/storage-methods', label: '보관방법' },
];
