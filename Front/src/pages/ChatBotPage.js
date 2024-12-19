// src/pages/ChatBotPage.js
import React, { useState } from 'react';
import ChatMessages from '../features/ChatBot/ChatMessages';
import ChatInput from '../features/ChatBot/ChatInput';
import OptionsModal from '../features/ChatBot/OptionsModal';
import RecipeRecommendationModal from '../features/ChatBot/RecipeRecommendationModal';
import HomeNavBar from '../components/organisms/HomeNavBar';
import NotificationBar from '../features/ChatBot/NotificationBar';
import { usePopupState } from '../hooks/usePopupState';

const ChatBotPage = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const optionsModal = usePopupState();
  const recipeModal = usePopupState();

  const addMessage = (message) => {
    setMessages((prevMessages) => (Array.isArray(prevMessages) ? [...prevMessages, message] : [message]));
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const handleImageUpload = (file) => {
    const imageUrl = URL.createObjectURL(file);
    addMessage({ sender: 'user', imageUrl });
  };

  return (
    <div className="chatbot-container">
      {/* 상단 알림창 */}
      <NotificationBar />

      {/* 채팅 메시지 영역 */}
      <ChatMessages messages={messages} />

      {/* 입력창 */}
      <ChatInput addMessage={addMessage} toggleOptions={optionsModal.open} disabled={optionsModal.isOpen} />

      {/* 옵션 모달 */}
      <OptionsModal
        isOpen={optionsModal.isOpen}
        onClose={optionsModal.close}
        clearMessages={clearMessages}
        handleImageUpload={handleImageUpload}
        openRecipeModal={recipeModal.open}
      />

      {/* 레시피 추천 모달 */}
      <RecipeRecommendationModal
        isOpen={recipeModal.isOpen}
        onClose={recipeModal.close}
      />

      {/* 하단 네비게이션 바 */}
      <HomeNavBar />
    </div>
  );
};

export default ChatBotPage;
