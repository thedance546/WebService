// src/pages/ChatBotPage.tsx

import React, { useState } from 'react';
import ChatMessages from '../features/ChatBot/ChatMessages';
import ChatInput from '../features/ChatBot/ChatInput';
import OptionsModal from '../features/ChatBot/OptionsModal';
import RecipeRecommendationModal from '../features/ChatBot/RecipeRecommendationModal';
import HomeNavBar from '../components/organisms/HomeNavBar';
import { usePopupState } from '../hooks/usePopupState';
import { DetectionResult, Message } from 'types/FeatureTypes';

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

  return (
    <div className="chatbot-container">
      <ChatMessages messages={messages} />
      <ChatInput addMessage={addMessage} toggleOptions={optionsModal.open} disabled={optionsModal.isOpen} />
      <OptionsModal
        isOpen={optionsModal.isOpen}
        onClose={optionsModal.close}
        clearMessages={clearMessages}
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
