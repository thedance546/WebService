// src/hooks/useAuth.js
import { useNavigate } from "react-router-dom";
import { login, logout, register, deleteAccount } from "../services/Api";
import { removeTokens } from "../utils/Utils";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const { success, message } = await login(email, password);
      if (success) {
        let accessToken = localStorage.getItem('accessToken');
        const userRole = jwtDecode(accessToken).role;
        navigate(userRole === 'ADMIN' ? '/admin' : '/my-ingredients');
      }
      return message;
    } catch (error) {
      throw new Error('로그인 실패: ' + error.message);
    }
  };

  const handleRegister = async (email, username, password) => {
    try {
      await register(email, username, password);
      navigate('/');
    } catch (error) {
      throw new Error('회원가입 실패: ' + error.message);
    }
  };

  const handleLogout = async () => {
    const { success, message } = await logout();
    if (success) {
      removeTokens();
      navigate('/');
    }
    return message;
  };

  const handleDeleteAccount = async () => {
    const { success, message } = await deleteAccount();
    if (success) {
      removeTokens();
      navigate('/');
    }
    return message;
  };

  return { handleLogin, handleRegister, handleLogout, handleDeleteAccount };
};

export default useAuth;
