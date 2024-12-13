// src/components/molecules/NavList.js
import React from 'react';
import NavItem from '../atoms/NavItem';

const NavList = ({ items }) => {
  return (
    <div className="d-flex justify-content-around w-100">
      {items.map(({ path, label }) => (
        <NavItem key={path} path={path} label={label} />
      ))}
    </div>
  );
};

export default NavList;
