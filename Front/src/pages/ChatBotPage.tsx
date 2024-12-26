// src/pages/ChatBotPage.tsx

import React, { useState } from 'react';
import ChatMessages from '../features/ChatBot/ChatMessages';
import ChatInput from '../features/ChatBot/ChatInput';
import OptionsModal from '../features/ChatBot/OptionsModal';
import RecipeRecommendationModal from '../features/ChatBot/RecipeRecommendationModal';
import CustomInfoInputModal from '../features/ChatBot/CustomInfoInputModal';
import QuickStartMessage from '../features/ChatBot/QuickStartMessage';
import HomeNavBar from '../components/organisms/HomeNavBar';
import { usePopupState } from '../hooks/usePopupState';
import { DetectionResult, Message } from '../types/FeatureTypes';
import botAvatar from '../assets/bot-avatar.png';

const ChatBotPage: React.FC = () => {
  const initialMessage: Message[] = [
    { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?', imageUrl: botAvatar },
  ];

  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : initialMessage;
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
    setMessages(initialMessage);
    localStorage.removeItem('chatMessages');
  };

  const handleQuickAction = (action: string) => {
    if (action === 'recommend_recipe') {
      addMessage({ sender: 'bot', text: '레시피 추천을 준비합니다.', imageUrl: botAvatar });
      recipeModal.open();
    } else if (action === 'input_info') {
      addMessage({ sender: 'bot', text: '정보 입력을 시작합니다.', imageUrl: botAvatar });
      customInfoModal.open();
    }
  };

  return (
    <div className="chatbot-container">
      <ChatMessages messages={messages} />
      {messages.length === 1 && (
        <QuickStartMessage onQuickAction={handleQuickAction} />
      )}
      <ChatInput addMessage={addMessage} toggleOptions={optionsModal.open} disabled={optionsModal.isOpen} />
      <OptionsModal
        isOpen={optionsModal.isOpen}
        onClose={optionsModal.close}
        clearMessages={clearMessages}
        openRecipeModal={recipeModal.open}
        openCustomInfoModal={customInfoModal.open}
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
      <CustomInfoInputModal
        isOpen={customInfoModal.isOpen}
        onClose={customInfoModal.close}
        onSubmit={(info) => console.log(info)}
      />
      <HomeNavBar />
    </div>
  );
};

export default ChatBotPage;
