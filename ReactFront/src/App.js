// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import Register from './components/Auth/Register';
import Authenticate from './components/Auth/Authenticate';
import Home from './components/Home/Home';
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