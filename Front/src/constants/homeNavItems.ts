// src/constants/homeNavItems.ts

export interface NavItem {
  path: string;
  label: string;
}

export const navItems: NavItem[] = [
  { path: '/food/my-ingredients', label: '나의 식재료' },
  { path: '/food/chatbot', label: '챗봇' },
  { path: '/food/settings', label: '설정' },
];
