// src/components/atoms/NavItem.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ path, label }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`btn ${isActive ? 'btn-primary' : 'btn-dark'} text-white`}
    >
      {label}
    </Link>
  );
};

export default NavItem;
