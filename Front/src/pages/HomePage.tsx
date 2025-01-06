// src/pages/HomePage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import GlobalBackground from '../components/templates/GlobalBackground';

const Home: React.FC = () => {
  return (
    <GlobalBackground title="맛집사">
      <nav className="d-grid gap-3">
        <Link to="/Register" className="btn btn-success btn-lg">회원가입</Link>
        <Link to="/Login" className="btn btn-primary btn-lg">로그인</Link>
        <div></div>
        <Link to="/food/my-Ingredients" className="btn btn-secondary btn-lg">로그인 없이 시작</Link>
      </nav>
    </GlobalBackground>
  );
};

export default Home;
