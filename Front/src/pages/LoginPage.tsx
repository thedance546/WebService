// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import GlobalBackground from '../components/templates/GlobalBackground';
import BackButton from '../components/molecules/BackButton';
import Button from '../components/atoms/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { login } = useAuthContext();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalBackground>
      <form onSubmit={onSubmit}>
        <div className="mb-3 d-flex align-items-center">
          <label className="form-label mb-0 me-4" style={{ width: '20%' }}>
            이메일
          </label>
          <input
            type="email"
            className="form-control"
            style={{ width: '80%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3 d-flex align-items-center">
          <label className="form-label mb-0 me-4" style={{ width: '20%' }}>
            비밀번호
          </label>
          <input
            type="password"
            className="form-control"
            style={{ width: '80%' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && <div className="text-danger mt-2">{error}</div>}
        <div className="d-flex justify-content-between mt-3">
          <BackButton className="btn btn-light" />
          <Button
            type="submit"
            className="btn w-50 ms-2"
            style={{ backgroundColor: 'var(--primary-color)', color: 'black' }}
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </div>
      </form>
    </GlobalBackground >
  );
};

export default LoginPage;
