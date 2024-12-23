// src/pages/ChatBotPage.tsx

import React, { useState } from 'react';
import ChatMessages from '../features/ChatBot/ChatMessages';
import ChatInput from '../features/ChatBot/ChatInput';
import OptionsModal from '../features/ChatBot/OptionsModal';
import RecipeRecommendationModal from '../features/ChatBot/RecipeRecommendationModal';
import HomeNavBar from '../components/organisms/HomeNavBar';
import NotificationBar from '../features/ChatBot/NotificationBar';
import { usePopupState } from '../hooks/usePopupState';
import { DetectionResult } from 'types/FeatureTypes';

interface Message {
  sender: string;
  imageUrl?: string;
}

const ChatBotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const optionsModal = usePopupState({ isOpen: false });
  const recipeModal = usePopupState({
    selectedFile: null as File | null,
    detectionResult: null as DetectionResult | null,
    loading: false,
  });
  

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    addMessage({ sender: 'user', imageUrl });
  };

  return (
    <div className="chatbot-container">
      <NotificationBar />
      <ChatMessages messages={messages} />
      <ChatInput addMessage={addMessage} toggleOptions={optionsModal.open} disabled={optionsModal.isOpen} />
      <OptionsModal
        isOpen={optionsModal.isOpen}
        onClose={optionsModal.close}
        clearMessages={clearMessages}
        handleImageUpload={handleImageUpload} // Props 추가
        openRecipeModal={recipeModal.open}
      />
      {recipeModal.isOpen && (
        <RecipeRecommendationModal
          isOpen={recipeModal.isOpen}
          onClose={() => {
            recipeModal.close();
            recipeModal.reset();
          }}
          state={recipeModal.state}
          setState={recipeModal.setState}
        />
      )}
      <HomeNavBar />
    </div>
  );
};

export default ChatBotPage;
