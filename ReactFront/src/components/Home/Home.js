// src/components/Home/Home.js

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 스타일 추가
import MyIngredients from '../Ingredients/MyIngredients';
import ChatBot from '../ChatBot/ChatBot';
import Notification from '../Notification/Notification';
import Settings from '../Settings/Settings';

const Home = () => {
  const [activeTab, setActiveTab] = useState('myIngredients');

  return (
    <div className="container-fluid d-flex flex-column vh-100">
      <div className="flex-grow-1 overflow-auto p-3">
        {activeTab === 'myIngredients' && <MyIngredients />}
        {activeTab === 'chatbot' && <ChatBot />}
        {activeTab === 'notifications' && <Notification />}
        {activeTab === 'settings' && <Settings />}
      </div>

      <div className="navbar bg-dark fixed-bottom d-flex justify-content-around">
        <button className="btn btn-dark text-white" onClick={() => setActiveTab('myIngredients')}>나의 식재료</button>
        <button className="btn btn-dark text-white" onClick={() => setActiveTab('chatbot')}>챗봇</button>
        <button className="btn btn-dark text-white" onClick={() => setActiveTab('notifications')}>알림</button>
        <button className="btn btn-dark text-white" onClick={() => setActiveTab('settings')}>설정</button>
      </div>
    </div>
  );
};

export default Home;
