// src/App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { refreshAccessToken } from './services/TokenManager';

import HomePage from './pages/HomePage';
import RegisterForm from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import MyIngredientsPage from './pages/MyIngredientsPage';
import ChatBotPage from './pages/ChatBotPage';
import SettingsPage from './pages/SettingsPage';

import { AdminProvider } from './contexts/AdminContext';
import AdminPage from './pages/AdminPage';
import IngredientsManagement from './pages/IngredientsManagement';
import UserManagement from './pages/UserManagement';
import CategoryManagement from './pages/CategoryManagement';
import StorageMethodManagement from './pages/StorageMethodManagement';

const App: React.FC = () => {
  useEffect(() => {
    (async () => {
      try {
        await refreshAccessToken();
        console.log("새로고침 시 토큰 갱신 성공");
      } catch (error: any) {
        console.error("토큰 갱신 실패:", error.message || error);
        window.location.href = '/login';
      }
    })();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/my-ingredients" element={<MyIngredientsPage />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/admin/*"
          element={
            <AdminProvider>
              <Routes>
                <Route path="" element={<AdminPage />} />
                <Route path="ingredients" element={<IngredientsManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="storage-methods" element={<StorageMethodManagement />} />
              </Routes>
            </AdminProvider>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
