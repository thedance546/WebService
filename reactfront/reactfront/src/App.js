import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register'; // 회원가입 페이지 컴포넌트
import Authenticate from './components/Authenticate'; // 로그인 페이지 컴포넌트

function App() {
  return (
    <Router>
      <div>
        <h1>React App</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} /> {/* 회원가입 경로 */}
          <Route path="/authenticate" element={<Authenticate />} /> {/* 로그인 경로 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
