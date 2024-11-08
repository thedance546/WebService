// Welcome.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-page">
      <h1>맛집사</h1>
      <div className="auth-box">
        <nav>
          <Link to="/Register" className="home-button">회원가입</Link>
          <Link to="/Authenticate" className="home-button">로그인</Link>
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
