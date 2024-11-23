// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/Api';
import GlobalBackground from '../components/Layout/GlobalBackground';

const Register = () => {
  const [emailLocal, setEmailLocal] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verifyEmail = async () => {
    if (!emailDomain.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      alert('유효한 이메일 도메인을 입력하세요.');
      return;
    }

    setLoading(true);
    try {
      const email = `${emailLocal}@${emailDomain}`;
      const response = await api.post('/auth/check-email', { email });
      alert(response.data.available ? '사용 가능한 이메일입니다.' : '이미 사용 중인 이메일입니다.');
    } catch (error) {
      alert('이메일 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const email = `${emailLocal}@${emailDomain}`;
      const response = await api.post('/auth/register', { email, username, password });
      alert(response.data.message || "회원가입이 완료되었습니다.");
      navigate('/');
    } catch (error) {
      alert(error.response?.data || '회원가입에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <GlobalBackground title="맛집사">
      <form onSubmit={handleRegister}>
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
            <button
              type="button"
              className="btn btn-primary ms-2"
              onClick={verifyEmail}
              disabled={loading}
              style={{ whiteSpace: 'nowrap', width: '60px' }}
            >
              확인
            </button>
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
          <button
            type="button"
            className="btn btn-secondary w-50 me-2"
            onClick={() => navigate('/')}
          >
            뒤로가기
          </button>
          <button
            type="submit"
            className="btn btn-success w-50 ms-2"
            disabled={loading}
          >
            회원가입
          </button>
        </div>
      </form>
    </GlobalBackground>
  );
};

export default Register;
