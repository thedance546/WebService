// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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

  return (
    <Router>
      <Routes>
        {/* 로그인 관련 경로 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 기능 탭 경로 */}
        <Route path="/my-ingredients" element={<MyIngredientsPage />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* 관리자 페이지 관련 경로 */}
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
