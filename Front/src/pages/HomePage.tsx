// src/pages/HomePage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import GlobalBackground from '../components/templates/GlobalBackground';
import logo from '../assets/matjipsa_logo.webp';
import title from '../assets/matjipsa_title.webp';

const Home: React.FC = () => {
  return (
    <GlobalBackground>
      {/* 로고와 타이틀 구역 */}
      <div
        className="d-flex align-items-center justify-content-center mb-4"
        style={{
          marginTop: '5rem', // 상단 여백
        }}
      >
        {/* 로고 */}
        <img
          src={logo}
          alt="맛집사 로고"
          style={{
            width: '100px',
            height: '100px',
            marginRight: '1rem', // 로고와 타이틀 간 간격
          }}
        />
        {/* 타이틀 */}
        <img
          src={title}
          alt="맛집사 타이틀"
          style={{
            width: '200px',
            height: 'auto',
          }}
        />
      </div>

      {/* 버튼 구역 */}
      <div
        className="d-grid gap-3"
        style={{
          width: '85%', // 버튼 너비 조정
          maxWidth: '400px', // 최대 너비
          margin: '0 auto', // 중앙 정렬
        }}
      >
        <Link to="/Register" className="btn btn-success btn-lg w-100">
          회원가입
        </Link>
        <Link to="/Login" className="btn btn-primary btn-lg w-100">
          로그인
        </Link>
        <Link to="/food/my-Ingredients" className="btn btn-secondary btn-lg w-100">
          로그인 없이 시작
        </Link>
      </div>
    </GlobalBackground>
  );
};

export default Home;
