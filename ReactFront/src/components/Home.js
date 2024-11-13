// Home.js
import React, { useState } from 'react';
import './Home.css';
import MyIngredients from './MyIngredients';
import Settings from './Settings';

const Home = () => {
  const [activeTab, setActiveTab] = useState('myIngredients');

  return (
    <div className="home-page">
      {/* 각 탭에 따라 다른 내용 표시 */}
      <div className="tab-content">
        {activeTab === 'myIngredients' && <MyIngredients />}
        {activeTab === 'chatbot' && <div>챗봇 화면</div>}
        {activeTab === 'notifications' && <div>알림 화면</div>}
        {activeTab === 'settings' && <Settings />}
      </div>

      {/* 네비게이션 바 */}
      <div className="navbar">
        <button onClick={() => setActiveTab('myIngredients')}>나의 식자재</button>
        <button onClick={() => setActiveTab('chatbot')}>챗봇</button>
        <button onClick={() => setActiveTab('notifications')}>알림</button>
        <button onClick={() => setActiveTab('settings')}>설정</button>
      </div>
    </div>
  );
};

export default Home;
