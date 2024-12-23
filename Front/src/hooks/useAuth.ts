// src/hooks/useAuth.ts

import { useNavigate } from "react-router-dom";
import { login, logout, register, deleteAccount } from "../services/AuthApi";
import { getAccessToken } from "../services/TokenManager";
import jwtDecode from "jwt-decode";

interface DecodedToken {
  role: string;
}

const useAuth = () => {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string): Promise<string> => {
    try {
      const { success, message } = await login(email, password);
      if (success) {
        const accessToken = getAccessToken();
        const { role }: DecodedToken = jwtDecode(accessToken);
        navigate(role === 'ADMIN' ? '/admin' : '/my-ingredients');
      }
      return message;
    } catch (error: any) {
      throw new Error('로그인 실패: ' + error.message);
    }
  };

  const handleRegister = async (email: string, username: string, password: string): Promise<void> => {
    try {
      await register(email, username, password);
      navigate('/');
    } catch (error: any) {
      throw new Error('회원가입 실패: ' + error.message);
    }
  };

  const handleLogout = async (): Promise<string> => {
    const { success, message } = await logout();
    if (success) {
      navigate('/');
    }
    return message;
  };

  const handleDeleteAccount = async (): Promise<string> => {
    const { success, message } = await deleteAccount();
    if (success) {
      navigate('/');
    }
    return message;
  };

  return { handleLogin, handleRegister, handleLogout, handleDeleteAccount };
};

export default useAuth;
