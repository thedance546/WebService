// App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider';
import { AdminProvider } from './contexts/AdminContext';
import { ChatbotProvider } from './contexts/ChatbotContext';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import ChatBotPage from './pages/ChatBotPage';
import SettingsPage from './pages/SettingsPage';
import MyIngredientsPage from './pages/MyIngredientsPage';

import AdminPage from './pages/AdminPage';
import ItemManagement from './pages/ItemManagement';
import UserManagement from './pages/UserManagement';
import CategoryManagement from './pages/CategoryManagement';
import StorageMethodManagement from './pages/StorageMethodManagement';
import { IngredientsProvider } from './contexts/IngredientsContext';

const FoodRoutes: React.FC = () => {
  return (
    <IngredientsProvider>
      <ChatbotProvider>
        <Routes>
          <Route path="/my-ingredients" element={<MyIngredientsPage />} />
          <Route path="/chatbot" element={<ChatBotPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </ChatbotProvider>
    </IngredientsProvider>
  );
};

const AdminRoutes: React.FC = () => {
  return (
    <AdminProvider>
      <Routes>
        <Route path="" element={<AdminPage />} />
        <Route path="ingredients" element={<ItemManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="storage-methods" element={<StorageMethodManagement />} />
      </Routes>
    </AdminProvider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 식재료 관련 경로 */}
          <Route path="/food/*" element={<FoodRoutes />} />

          {/* 관리자 페이지 경로 */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
