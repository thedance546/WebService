// src/components/organisms/NavBar.js
import React from 'react';
import NavList from '../molecules/NavList';

const NavBar = ({ navItems }) => (
  <div className="navbar bg-dark fixed-bottom d-flex">
    <NavList items={navItems} />
  </div>
);
  
  export default NavBar;