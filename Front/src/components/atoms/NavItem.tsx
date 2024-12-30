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
      className={({ isActive }) =>
        isActive ?
      "text-white text-decoration-none mx-3 font-weight-bold" :
      "text-white text-decoration-none mx-3"
      }
    >
      {label}
    </NavLink>
  );
};

export default NavItem;
