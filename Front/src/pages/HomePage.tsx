// src/pages/HomePage.tsx

import React from 'react';
import GlobalBackground from '../components/templates/GlobalBackground';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <GlobalBackground>
      <div className="d-grid gap-3" style={{ width: '85%', maxWidth: '400px', margin: '0 auto' }}>
        <Button
          onClick={() => navigate('/Register')}
          className="btn-lg w-100"
          style={{ backgroundColor: '#DFF4E0', color: 'black' }}
        >
          회원가입
        </Button>
        <Button
          onClick={() => navigate('/Login')}
          className="btn-lg w-100"
          style={{ backgroundColor: 'var(--primary-color)', color: 'black' }}
        >
          로그인
        </Button>
      </div>
    </GlobalBackground>
  );
};

export default Home;
