// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import RegisterForm from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import MyIngredients from './pages/MyIngredients';
import Notification from './pages/Notification';
import ChatBot from './pages/ChatBot';
import Settings from './pages/Settings';

import { AdminProvider } from './contexts/AdminContext';
import AdminPage from './pages/AdminPage';
import ItemManagement from './pages/ItemManagement';
import UserManagement from './pages/UserManagement';
import CategoryManagement from './pages/CategoryManagement';
import StorageMethodManagement from './pages/StorageMethodManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* 로그인 관련 경로 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 기능 탭 경로 */}
        <Route path="/my-ingredients" element={<MyIngredients />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/settings" element={<Settings />} />
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