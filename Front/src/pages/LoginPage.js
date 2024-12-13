// src/pages/LoginPage.js
import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import GlobalBackground from '../components/templates/GlobalBackground';
import BackButton from '../components/molecules/BackButton';
import Button from '../components/atoms/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { handleLogin } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleLogin(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalBackground title="맛집사">
      <form onSubmit={onSubmit}>
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
          <BackButton />
          <Button type="submit" className="btn btn-primary w-50 ms-2" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </div>
      </form>
    </GlobalBackground>
  );
};

export default LoginPage;
