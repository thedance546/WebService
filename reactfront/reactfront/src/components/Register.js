import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/register',
        {
          email,
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json', // 필요한 다른 헤더
          },
        }
      );
  
      // 서버에서 반환된 메시지를 사용하여 성공 알림 표시
      const successMessage = response.data.message || "회원가입이 완료되었습니다."; // 예: "회원가입이 완료되었습니다."
      alert(successMessage); // 성공 메시지 표시
  
      navigate('/'); // 회원가입 후 홈 화면으로 이동
    } catch (error) {
      const errorMessage = error.response ? error.response.data : '회원가입에 실패했습니다. 다시 시도해 주세요.';
      console.error('회원가입 실패:', errorMessage);
      alert(errorMessage); // 실패 메시지 표시
    }
  };
  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleRegister}>
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
          <label>아이디:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Register;
