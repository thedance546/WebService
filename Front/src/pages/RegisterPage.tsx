// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import GlobalBackground from '../components/templates/GlobalBackground';
import BackButton from '../components/molecules/BackButton';
import Button from '../components/atoms/Button';

const RegisterPage: React.FC = () => {
  const [emailLocal, setEmailLocal] = useState<string>('');
  const [emailDomain, setEmailDomain] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuthContext();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = `${emailLocal}@${emailDomain}`;
      await register(email, username, password);
      alert('회원가입이 완료되었습니다.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalBackground>
      <form onSubmit={onSubmit}>
        <div className="mb-3 d-flex align-items-center">
          <label className="form-label mb-0" style={{ width: '15%', color: 'white' }}>
            이메일
          </label>
          <div className="d-flex" style={{ width: '85%' }}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="이메일 앞부분"
              value={emailLocal}
              onChange={(e) => setEmailLocal(e.target.value)}
              required
            />
            <span className="input-group-text">@</span>
            <input
              type="text"
              className="form-control ms-2"
              placeholder="도메인 (예: example.com)"
              value={emailDomain}
              onChange={(e) => setEmailDomain(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mb-3 d-flex align-items-center">
          <label className="form-label mb-0" style={{ width: '15%', color: 'white' }}>
            아이디
          </label>
          <input
            type="text"
            className="form-control"
            style={{ width: '85%' }}
            placeholder="아이디 입력"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 d-flex align-items-center">
          <label className="form-label mb-0" style={{ width: '15%', color: 'white' }}>
            비밀번호
          </label>
          <input
            type="password"
            className="form-control"
            style={{ width: '85%' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-flex justify-content-between mt-3">
          <BackButton className="btn btn-light ms-2" />
          <Button
            type="submit"
            className="btn ms-2"
            style={{
              backgroundColor: '#A1D4A3',
              color: 'black',
            }}
            disabled={loading}
          >
            회원가입
          </Button>
        </div>
      </form>
    </GlobalBackground>
  );
};

export default RegisterPage;
