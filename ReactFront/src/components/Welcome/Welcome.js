// src/components/Welcome/Welcome.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../Settings/LogoutButton';

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
    <div className="d-flex flex-column align-items-center min-vh-100 justify-content-center bg-light text-center">
      <h1 className="mb-4">맛집사</h1>
      <div className="card p-4 shadow-sm" style={{ maxWidth: '300px', width: '100%' }}>
        <nav className="d-grid gap-2">
          {isLoggedIn ? (
            <LogoutButton onLogoutSuccess={handleLogoutSuccess} />
          ) : (
            <>
              <Link to="/Register" className="btn btn-success">회원가입</Link>
              <Link to="/Authenticate" className="btn btn-primary">로그인</Link>
            </>
          )}
        </nav>
      </div>
      
      <div className="mt-3">
        <Link to="/Home" className="btn btn-secondary">테스트용</Link>
      </div>
    </div>
  );
};

export default Welcome;
