// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';
import Register from './components/Register'; // 회원가입 페이지 컴포넌트
import Authenticate from './components/Authenticate'; // 로그인 페이지 컴포넌트
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/Register" element={<Register />} /> {/* 회원가입 경로 */}
          <Route path="/Authenticate" element={<Authenticate />} /> {/* 로그인 경로 */}
          <Route path="/Home" element={<Home />} /> {/* 홈 경로 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;