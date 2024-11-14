// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import Register from './components/Auth/Register';
import Authenticate from './components/Auth/Authenticate';
import Home from './components/Home/Home';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Authenticate" element={<Authenticate />} />
          <Route path="/Home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
