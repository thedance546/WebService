// src/components/UI/NavBar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  const navItems = [
    { path: '/my-ingredients', label: '나의 식재료' },
    { path: '/chatbot', label: '챗봇' },
    { path: '/notifications', label: '알림' },
    { path: '/settings', label: '설정' },
  ];

  return (
    <div className="navbar bg-dark fixed-bottom d-flex justify-content-around">
      {navItems.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className={`btn ${location.pathname === path ? 'btn-primary' : 'btn-dark'} text-white`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default NavBar;
