// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterForm from './pages/RegisterForm';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Register" element={<RegisterForm />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Home" element={<MainPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
