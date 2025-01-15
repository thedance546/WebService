// src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import GlobalBackground from '../components/templates/GlobalBackground';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후 fadeIn 상태를 true로 설정
    const timer = setTimeout(() => setFadeIn(true), 500);
    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  const buttonStyle = {
    transition: 'opacity 3s ease-in-out, transform 3s ease-in-out', // 3초 동안 천천히 나타남
    opacity: fadeIn ? 1 : 0, // 투명도 제어
    transform: fadeIn ? 'translateY(0)' : 'translateY(20px)', // 아래에서 위로 이동
  };

  return (
    <GlobalBackground>
      <div className="d-grid gap-3" style={{ width: '85%', maxWidth: '400px', margin: '0 auto' }}>
        <Button
          onClick={() => navigate('/Register')}
          className="btn-lg w-100"
          style={{ ...buttonStyle, backgroundColor: '#DFF4E0', color: 'black' }}
        >
          회원가입
        </Button>
        <Button
          onClick={() => navigate('/Login')}
          className="btn-lg w-100"
          style={{ ...buttonStyle, backgroundColor: 'var(--primary-color)', color: 'black' }}
        >
          로그인
        </Button>
      </div>
    </GlobalBackground>
  );
};

export default Home;
