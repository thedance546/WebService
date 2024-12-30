// src/components/atoms/NavItem.js

import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ path, label }) => {
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
