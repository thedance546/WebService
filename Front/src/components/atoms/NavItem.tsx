// src/components/atoms/NavItem.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  path: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ path, label }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
    >
      {label}
    </NavLink>
  );
};

export default NavItem;
