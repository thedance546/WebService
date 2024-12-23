// src/components/molecules/NavList.tsx

import React from 'react';
import NavItem from '../atoms/NavItem';

interface NavListProps {
  items: {
    path: string;
    label: string;
  }[];
}

const NavList: React.FC<NavListProps> = ({ items }) => {
  return (
    <div className="d-flex justify-content-around w-100">
      {items.map(({ path, label }) => (
        <NavItem key={path} path={path} label={label} />
      ))}
    </div>
  );
};

export default NavList;
