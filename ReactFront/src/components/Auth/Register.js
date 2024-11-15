// src/components/Auth/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';
import GlobalBackground from '../Common/GlobalBackground';

const Register = () => {
  const [emailLocal, setEmailLocal] = useState(''); // 이메일 앞부분
  const [emailDomain, setEmailDomain] = useState(''); // 이메일 뒷부분
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailVerified, setEmailVerified] = useState(false); // 이메일 중복 확인 완료 여부
  const [usernameVerified, setUsernameVerified] = useState(false); // 아이디 중복 확인 완료 여부
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // 테스트 단계에서는 중복확인 검증 없이 회원가입 허용
    // if (!emailVerified || !usernameVerified) {
    //   alert('이메일과 아이디 중복 확인을 완료해 주세요.');
    //   return;
    // }

    try {
      const email = `${emailLocal}@${emailDomain}`;
      const response = await api.post('/auth/register', { email, username, password });
      alert(response.data.message || "회원가입이 완료되었습니다.");
      navigate('/');
    } catch (error) {
      alert(error.response?.data || '회원가입에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const verifyEmail = async () => {
    const email = `${emailLocal}@${emailDomain}`;
    if (!emailDomain.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      alert('유효한 이메일 도메인을 입력하세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/check-email', { email });
      if (response.data.available) {
        setEmailVerified(true);
        alert('사용 가능한 이메일입니다.');
      } else {
        alert('이미 사용 중인 이메일입니다.');
      }
    } catch (error) {
      alert('이메일 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const verifyUsername = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/check-username', { username });
      if (response.data.available) {
        setUsernameVerified(true);
        alert('사용 가능한 아이디입니다.');
      } else {
        alert('이미 사용 중인 아이디입니다.');
      }
    } catch (error) {
      alert('아이디 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalBackground title="맛집사">
      <form onSubmit={handleRegister}>
        {/* 이메일 입력 */}
        <div className="mb-3">
          <label className="form-label">이메일</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="이메일 앞부분"
              value={emailLocal}
              onChange={(e) => setEmailLocal(e.target.value)}
              disabled={emailVerified}
              required
            />
            <span className="input-group-text">@</span>
            <input
              type="text"
              className="form-control"
              placeholder="도메인 (예: example.com)"
              value={emailDomain}
              onChange={(e) => setEmailDomain(e.target.value)}
              disabled={emailVerified}
              required
            />
            {emailVerified ? (
              <span className="input-group-text text-success">✔</span>
            ) : (
              <button
                type="button"
                className="btn btn-primary ms-2"
                onClick={verifyEmail}
                disabled={loading}
                style={{ whiteSpace: 'nowrap', width: '60px' }}
              >
                확인
              </button>
            )}
          </div>
        </div>

        {/* 아이디 입력 */}
        <div className="mb-3">
          <label className="form-label">아이디</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="아이디 입력"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={usernameVerified}
              required
            />
            {usernameVerified ? (
              <span className="input-group-text text-success">✔</span>
            ) : (
              <button
                type="button"
                className="btn btn-primary ms-2"
                onClick={verifyUsername}
                disabled={loading}
                style={{ whiteSpace: 'nowrap', width: '60px' }}
              >
                확인
              </button>
            )}
          </div>
        </div>

        {/* 비밀번호 입력 */}
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

        {/* 버튼 */}
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
