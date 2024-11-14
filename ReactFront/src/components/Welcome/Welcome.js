// src/components/Welcome/Welcome.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../Settings/LogoutButton';
import './Welcome.css';

const Welcome = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
    if (token) {
      navigate('/Home'); // 로그인 상태일 때 /Home으로 리다이렉트
    }
  }, [navigate]);

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="welcome-page">
      <h1>맛집사</h1>
      <div className="auth-box">
        <nav>
          {isLoggedIn ? (
            <LogoutButton onLogoutSuccess={handleLogoutSuccess} />
          ) : (
            <>
              <Link to="/Register" className="home-button">회원가입</Link>
              <Link to="/Authenticate" className="home-button">로그인</Link>
            </>
          )}
        </nav>
      </div>
      
      <div className="test-link">
        <Link to="/Home" className="home-button">테스트용</Link>
      </div>
    </div>
  );
};

export default Welcome;
