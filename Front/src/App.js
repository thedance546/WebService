// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterForm from './pages/RegisterForm';
import LoginPage from './pages/LoginPage';

import MyIngredients from './pages/MyIngredients';
import ChatBot from './pages/ChatBot';
import Notification from './pages/Notification';
import Settings from './pages/Settings';
import Admin from './pages/AdminPage';

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
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
