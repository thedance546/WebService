import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Authenticate = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [error, setError] = useState(''); // 오류 메시지 상태 추가
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true); // 로딩 상태 시작
    setError(''); // 이전 오류 초기화

    try {
      // 로그인 요청
      const response = await axios.post(
        'http://localhost:8080/api/auth/authenticate', // 서버 엔드포인트 수정
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // 서버에서 받은 토큰이 있을 경우, localStorage에 저장
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        alert('로그인 성공');
        navigate('/'); // 홈 화면으로 이동
      } else {
        setError('로그인 실패: 토큰이 없습니다.');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setError('로그인에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
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
          <label>비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>로그인</button>
      </form>

      {/* 로딩 상태 표시 */}
      {loading && <p>로그인 중...</p>}

      {/* 오류 메시지 표시 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Authenticate;
