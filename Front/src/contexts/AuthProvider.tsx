// src/contexts/AuthProvider.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  deleteAccount as apiDeleteAccount
} from '../services/AuthApi';
import {
  refreshAccessToken as apiRefreshAccessToken,
  getAccessToken
} from '../services/TokenManager';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './AuthContext';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      await apiLogin(email, password);
      await refreshAccessToken();

      const accessToken = getAccessToken();
      const { id, email: userEmail, role } = jwtDecode<DecodedToken>(accessToken);

      setIsAuthenticated(true);
      setUser({ id, email: userEmail, role });

      // Role 기반 네비게이션
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/food/my-ingredients');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      navigate('/');
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      await apiRegister(email, username, password);
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      await apiDeleteAccount();
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      throw error;
    }
  };

  const refreshAccessToken = async () => {
    try {
      await apiRefreshAccessToken();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await refreshAccessToken();
      } catch {
        console.debug('초기 토큰 갱신 실패, 로그인 필요');
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, deleteAccount, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
