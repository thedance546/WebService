// src/components/organisms/HomeNavBar.js
import React from 'react';
import NavList from '../molecules/NavList';

const HomeNavBar = ({ navItems }) => (
  <div className="navbar bg-dark fixed-bottom d-flex">
    <NavList items={navItems} />
  </div>
);
  
  export default HomeNavBar;