// src/components/Auth/Authenticate.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';
import GlobalBackground from '../Common/GlobalBackground';

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
      navigate('/home');
    } catch (error) {
      setError('로그인에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalBackground title="맛집사">
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">이메일</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        {error && <div className="text-danger mt-2">{error}</div>}
        <div className="d-flex justify-content-between mt-3">
          <button
            type="button"
            className="btn btn-secondary w-50 me-2"
            onClick={() => navigate('/')}
          >
            뒤로가기
          </button>
          <button
            type="submit"
            className="btn btn-primary w-50 ms-2"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </div>
      </form>
    </GlobalBackground>
  );
};

export default Authenticate;
