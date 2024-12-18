// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import RegisterForm from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import MyIngredientsPage from './pages/MyIngredientsPage';
import ChatBotPage from './pages/ChatBotPage';
import SettingsPage from './pages/SettingsPage';

import { AdminProvider } from './contexts/AdminContext';
import AdminPage from './pages/AdminPage';
import ItemManagement from './pages/ItemManagement';
import UserManagement from './pages/UserManagement';
import CategoryManagement from './pages/CategoryManagement';
import StorageMethodManagement from './pages/StorageMethodManagement';

function App() {
  useEffect(() => {
    const hideAddressBar = () => { setTimeout(() => { window.scrollTo(0, 1); }, 0); };
    window.addEventListener("load", hideAddressBar);
    return () => { window.removeEventListener("load", hideAddressBar); }; }, []);
  
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
      </Routes>
      
      <AdminProvider>
        <Routes>
          {/* 관리자 페이지 관련 경로 */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/items" element={<ItemManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/storage-method" element={<StorageMethodManagement />} />
        </Routes>
      </AdminProvider>
    </Router>
  );
}

export default App;