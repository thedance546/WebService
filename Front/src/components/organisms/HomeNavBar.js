// src/components/organisms/HomeNavBar.js
import React from 'react';
import NavList from '../molecules/NavList';
import { navItems } from '../../constants/homeNavItems';

const HomeNavBar = () => (
  <div className="navbar bg-dark fixed-bottom d-flex">
    <NavList items={navItems} />
  </div>
);
  
  export default HomeNavBar;