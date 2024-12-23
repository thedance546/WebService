// src/constants/homeNavItems.ts

export interface NavItem {
  path: string;
  label: string;
}

export const navItems: NavItem[] = [
  { path: '/my-ingredients', label: '나의 식재료' },
  { path: '/chatbot', label: '챗봇' },
  { path: '/settings', label: '설정' },
];
