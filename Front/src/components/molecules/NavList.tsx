// src/components/molecules/NavList.tsx

import React from 'react';
import NavItem from '../atoms/NavItem';

interface NavListProps {
  items: {
    path: string;
    label: string;
  }[];
  className?: string;
}

const NavList: React.FC<NavListProps> = ({ items, className = '' }) => {
  return (
    <div className={`d-flex ${className}`}>
      {items.map(({ path, label }) => (
        <NavItem key={path} path={path} label={label} />
      ))}
    </div>
  );
};

export default NavList;
