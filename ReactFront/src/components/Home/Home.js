// src/components/Home/Home.js

import React, { useState } from 'react';
import MyIngredients from '../Ingredients/MyIngredients';
import ChatBot from '../ChatBot/ChatBot';
import Notification from '../Notification/Notification';
import Settings from '../Settings/Settings';
import { Plus } from 'react-bootstrap-icons';

const Home = () => {
  const [activeTab, setActiveTab] = useState('myIngredients');
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가

  const handleFABClick = () => {
    setShowModal(true); // 식재료 추가 모달 열기
  };

  const closeModal = () => {
    setShowModal(false); // 모달 닫기
  };

  return (
    <div className="d-flex flex-column vh-100">
      <div className="flex-grow-1 overflow-auto p-3">
        {activeTab === 'myIngredients' && <MyIngredients showModal={showModal} closeModal={closeModal} />}
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

      {/* 플로팅 액션 버튼 (FAB) */}
      <button
        className="btn btn-success position-fixed"
        style={{
          bottom: '80px', // 네비게이션 바 위쪽에 위치
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
        }}
        onClick={handleFABClick} // FAB 버튼 클릭 시 모달 열기
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default Home;
