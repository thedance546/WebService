// src/components/organisms/HomeNavBar.tsx

import React from 'react';
import NavList from '../molecules/NavList';
import { navItems } from '../../constants/HomeNavItems';
import './HomeNavBar.css';

const HomeNavBar: React.FC = () => (
  <div
    className="container navbar bg-dark fixed-bottom"
    style={{
      height: 'var(--navbar-height)',
    }}
  >
    <NavList items={navItems} className="navbar-nav-list-responsive" />
  </div>
);

export default HomeNavBar;
