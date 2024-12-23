// src/constants/adminNavItems.ts

export interface NavItem {
  path: string;
  label: string;
}

export const navItems: NavItem[] = [
  { path: '/admin/items', label: '식재료' },
  { path: '/admin/users', label: '유저' },
  { path: '/admin/categories', label: '카테고리' },
  { path: '/admin/storage-method', label: '보관방법' },
];
