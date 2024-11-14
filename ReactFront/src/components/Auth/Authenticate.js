// src/components/Auth/Authenticate.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';

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
      navigate('/');
    } catch (error) {
      setError('로그인에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
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
        <h2 className="text-center">로그인</h2>
        <form onSubmit={handleLogin}>
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
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
          {error && <div className="text-danger mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Authenticate;
