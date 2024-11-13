// src/components/Authenticate.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/Api';
import './Authenticate.css';

const Authenticate = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/authenticate', { email, password });
      const { token } = response.data;
      localStorage.setItem('accessToken', token);
      alert('로그인 성공');
      navigate('/'); // 로그인 성공 시 홈으로 이동
    } catch (error) {
      console.error('로그인 실패:', error);
      setError('로그인에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authenticate-page">
      <button onClick={() => navigate('/')} className="back-button">
        &lt; 뒤로가기
      </button>
      <div className="authenticate-content">
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>이메일:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>로그인</button>
        </form>
        {loading && <p>로그인 중...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default Authenticate;
