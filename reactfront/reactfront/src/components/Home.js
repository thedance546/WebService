import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  return (
    <div>
      <h2>홈 화면</h2>
      <nav>
        <Link to="/register">회원가입</Link> | 
        <Link to="/authenticate">로그인</Link>
      </nav>
    </div>
  );
};

export default Home;
