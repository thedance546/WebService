// src/components/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', { email, username, password });
      alert(response.data.message || "회원가입이 완료되었습니다.");
      navigate('/'); // 회원가입 성공 시 홈으로 이동
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(error.response?.data || '회원가입에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="register-page">
      <div className="back-button-container">
        <button onClick={() => navigate('/')} className="back-button">
          &lt; 뒤로가기
        </button>
      </div>
      <div className="register-content">
        <h2>회원가입</h2>
        <form onSubmit={handleRegister}>
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
            <label>아이디:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <button type="submit">회원가입</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
