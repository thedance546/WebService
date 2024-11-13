// Welcome.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import './Welcome.css';

const Welcome = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에 토큰이 있는지 확인하여 로그인 상태 설정
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogoutSuccess = () => {
    // 로그아웃 후 상태 초기화 및 페이지 이동
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    navigate('/Authenticate');
  };

  return (
    <div className="welcome-page">
      <h1>맛집사</h1>
      <div className="auth-box">
        <nav>
          {isLoggedIn ? (
            <LogoutButton
              accessToken={localStorage.getItem('accessToken')}
              refreshToken={localStorage.getItem('refreshToken')}
              onLogoutSuccess={handleLogoutSuccess}
            />
          ) : (
            <>
              <Link to="/Register" className="home-button">회원가입</Link>
              <Link to="/Authenticate" className="home-button">로그인</Link>
            </>
          )}
        </nav>
      </div>
      
      {/* 테스트용 다음 페이지 링크 (박스 외부) */}
      <div className="test-link">
        <Link to="/Home" className="home-button">테스트용</Link>
      </div>
    </div>
  );
};

export default Welcome;
