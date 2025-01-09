// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import GlobalBackground from '../components/templates/GlobalBackground';
import BackButton from '../components/molecules/BackButton';
import Button from '../components/atoms/Button';
import logo from '../assets/matjipsa_logo.webp';
import title from '../assets/matjipsa_title.webp';

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
      {/* 로고와 타이틀 구역 */}
      <div
        className="d-flex align-items-center justify-content-center mb-4"
        style={{
          marginTop: '5rem', // 상단 여백
        }}
      >
        <img
          src={logo}
          alt="맛집사 로고"
          style={{
            width: '100px',
            height: '100px',
            marginRight: '1rem',
          }}
        />
        <img
          src={title}
          alt="맛집사 타이틀"
          style={{
            width: '200px',
            height: 'auto',
          }}
        />
      </div>

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">이메일</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="이메일 앞부분"
              value={emailLocal}
              onChange={(e) => setEmailLocal(e.target.value)}
              required
            />
            <span className="input-group-text">@</span>
            <input
              type="text"
              className="form-control"
              placeholder="도메인 (예: example.com)"
              value={emailDomain}
              onChange={(e) => setEmailDomain(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">아이디</label>
          <input
            type="text"
            className="form-control"
            placeholder="아이디 입력"
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
        <div className="d-flex justify-content-between mt-3">
          <BackButton />
          <Button type="submit" className="btn btn-success w-50 ms-2" disabled={loading}>
            회원가입
          </Button>
        </div>
      </form>
    </GlobalBackground>
  );
};

export default RegisterPage;
