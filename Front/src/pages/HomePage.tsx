// src/pages/HomePage.tsx

import React from 'react';
import GlobalBackground from '../components/templates/GlobalBackground';
import logo from '../assets/matjipsa_logo.webp';
import title from '../assets/matjipsa_title.webp';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <GlobalBackground>
      {/* 로고와 타이틀 */}
      <div
        className="d-flex align-items-center justify-content-center mb-4"
        style={{ marginTop: '5rem' }}
      >
        {/* 로고 */}
        <img
          src={logo}
          alt="맛집사 로고"
          style={{ width: '100px', height: '100px', marginRight: '1rem' }}
        />
        {/* 타이틀 */}
        <img
          src={title}
          alt="맛집사 타이틀"
          style={{ width: '200px', height: 'auto' }}
        />
      </div>

      {/* 버튼들 */}
      <div className="d-grid gap-3" style={{ width: '85%', maxWidth: '400px', margin: '0 auto' }}>
        <Button onClick={() => navigate('/Register')} className="btn-lg w-100" variant="success">
          회원가입
        </Button>
        <Button onClick={() => navigate('/Login')} className="btn-lg w-100" variant="primary">
          로그인
        </Button>
        <Button onClick={() => navigate('/food/my-Ingredients')} className="btn-lg w-100" variant="secondary">
          로그인 없이 시작
        </Button>
      </div>
    </GlobalBackground>
  );
};

export default Home;
