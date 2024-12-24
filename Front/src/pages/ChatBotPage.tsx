// src/pages/ChatBotPage.tsx

import React, { useState } from 'react';
import ChatMessages from '../features/ChatBot/ChatMessages';
import ChatInput from '../features/ChatBot/ChatInput';
import OptionsModal from '../features/ChatBot/OptionsModal';
import RecipeRecommendationModal from '../features/ChatBot/RecipeRecommendationModal';
import CustomInfoInputModal from '../features/ChatBot/CustomInfoInputModal';
import HomeNavBar from '../components/organisms/HomeNavBar';
import { usePopupState } from '../hooks/usePopupState';
import { DetectionResult, Message } from '../types/FeatureTypes';

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
  const customInfoModal = usePopupState({ isOpen: false });

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const handleCustomInfoSubmit = (info: string) => {
    console.log('입력된 정보:', info);
    // 필요한 추가 작업 수행
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
        openCustomInfoModal={customInfoModal.open}
      />
      {<RecipeRecommendationModal
        isOpen={recipeModal.isOpen}
        onClose={() => {
          recipeModal.close();
          recipeModal.reset();
        }}
        state={recipeModal.state}
        setState={recipeModal.setState}
      />
      }
      <CustomInfoInputModal
        isOpen={customInfoModal.isOpen}
        onClose={customInfoModal.close}
        onSubmit={handleCustomInfoSubmit}
      />
      <HomeNavBar />
    </div>
  );
};

export default ChatBotPage;
