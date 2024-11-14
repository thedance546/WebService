// src/components/Auth/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';

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
      navigate('/');
    } catch (error) {
      alert(error.response?.data || '회원가입에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center min-vh-100 justify-content-center bg-light">
      <div className="position-absolute top-0 start-0 m-3">
        <button onClick={() => navigate('/')} className="btn btn-link text-dark">
          &lt; 뒤로가기
        </button>
      </div>
      <div className="card p-4 shadow-sm w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center">회원가입</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">이메일</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">아이디</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
