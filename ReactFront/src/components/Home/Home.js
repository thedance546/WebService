// src/components/Home/Home.js

import React, { useState } from 'react';
import './Home.css';
import MyIngredients from '../Ingredients/MyIngredients';
import ChatBot from '../ChatBot/ChatBot';
import Notification from '../Notification/Notification';
import Settings from '../Settings/Settings';

const Home = () => {
  const [activeTab, setActiveTab] = useState('myIngredients');

  return (
    <div className="home-page">
      <div className="tab-content">
        {activeTab === 'myIngredients' && <MyIngredients />}
        {activeTab === 'chatbot' && <ChatBot />}
        {activeTab === 'notifications' && <Notification />}
        {activeTab === 'settings' && <Settings />}
      </div>

      <div className="navbar">
        <button onClick={() => setActiveTab('myIngredients')}>나의 식재료</button>
        <button onClick={() => setActiveTab('chatbot')}>챗봇</button>
        <button onClick={() => setActiveTab('notifications')}>알림</button>
        <button onClick={() => setActiveTab('settings')}>설정</button>
      </div>
    </div>
  );
};

export default Home;
