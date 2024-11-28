// src/components/organisms/NavBar.js
import React from 'react';
import NavList from '../molecules/NavList';

const NavBar = () => {
    const navItems = [
      { path: '/my-ingredients', label: '나의 식재료' },
      { path: '/chatbot', label: '챗봇' },
      { path: '/notifications', label: '알림' },
      { path: '/settings', label: '설정' },
    ];
  
    return (
      <div className="navbar bg-dark fixed-bottom d-flex">
        <NavList items={navItems} />
      </div>
    );
  };
  
  export default NavBar;