// src/components/Home/Home.js
import React, { useState } from 'react';
import MyIngredients from '../Ingredients/MyIngredients';
import ChatBot from '../ChatBot/ChatBot';
import Notification from '../Notification/Notification';
import Settings from '../Settings/Settings';

const Home = () => {
  const [activeTab, setActiveTab] = useState('myIngredients');

  return (
    <div className="d-flex flex-column vh-100">
      {/* 콘텐츠 영역 */}
      <div className="flex-grow-1 overflow-hidden p-3 pb-5">
        {activeTab === 'myIngredients' && <MyIngredients />}
        {activeTab === 'chatbot' && <ChatBot />}
        {activeTab === 'notifications' && <Notification />}
        {activeTab === 'settings' && <Settings />}
      </div>

      {/* 네비게이션 바 */}
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
