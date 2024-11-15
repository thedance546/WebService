// src/components/Welcome/Welcome.js
import React from 'react';
import { Link } from 'react-router-dom';
import GlobalBackground from '../Common/GlobalBackground';

const Welcome = () => {
  return (
    <GlobalBackground title="맛집사">
      <nav className="d-grid gap-3">
        <Link to="/Register" className="btn btn-success btn-lg">회원가입</Link>
        <Link to="/Authenticate" className="btn btn-primary btn-lg">로그인</Link>
      </nav>
      <div className="mt-3">
        <Link to="/Home" className="btn btn-secondary btn-lg">테스트용</Link>
      </div>
    </GlobalBackground>
  );
};

export default Welcome;
