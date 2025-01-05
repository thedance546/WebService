// src/constants/homeNavItems.ts

export interface NavItem {
  path: string;
  label: string;
}

export const navItems: NavItem[] = [
  { path: '/new-ingredients', label: '나의 식재료' },
  { path: '/my-ingredients', label: '이전 식재료' },
  { path: '/chatbot', label: '챗봇' },
  { path: '/settings', label: '설정' },
];
