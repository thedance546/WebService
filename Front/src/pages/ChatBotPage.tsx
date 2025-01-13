// src/pages/ChatBotPage.tsx

import React, { useState } from 'react';
import CommonHeader from "../components/organisms/CommonHeader";
import ChatMessages from '../features/ChatBot/ChatMessages';
import ChatInput from '../features/ChatBot/ChatInput';
import OptionsModal from '../features/ChatBot/ChatBotOptionsModal';
import IngredientUploadModal from '../features/ChatBot/IngredientUploadModal';
import CustomInfoInputModal from '../features/ChatBot/CustomInfoInputModal';
import RecipeRecommendationModal from '../features/ChatBot/RecipeRecommendationModal';
import HomeNavBar from '../components/organisms/HomeNavBar';
import { usePopupState } from '../hooks/usePopupState';
import { Message, Sender } from '../types/FeatureTypes';
import { Ingredient } from '../types/EntityTypes';
import botAvatar from '../assets/matjipsa_logo.webp';

const ChatBotPage: React.FC = () => {
  const initialMessage: Message[] = [
    { sender: Sender.Bot, text: '안녕하세요! 맛집사 챗봇입니다!\n식재료 정보나 관리에 대해 물어보세요\nAI 레시피 추천은 옵션에서 할 수 있습니다', profileImage: botAvatar },
  ];

  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : initialMessage;
  });

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const optionsModal = usePopupState({ isOpen: false });
  const recipeModal = usePopupState({
    selectedFile: null as File | null,
    detectionResult: null as any,
    previewUrl: null as string | null,
    loading: false,
  });
  const detectionModal = usePopupState({
    isOpen: false,
    ingredients: [] as Ingredient[],
  });
  const customInfoModal = usePopupState({ isOpen: false });

  const clearMessages = () => {
    setMessages(initialMessage);
    localStorage.removeItem('chatMessages');
  };

  return (
    <div className="container">
      <CommonHeader pageTitle="챗봇" />

      <ChatMessages messages={messages} />

      <ChatInput
        addMessage={addMessage}
        toggleOptions={optionsModal.open}
        disabled={optionsModal.isOpen}
      />

      <OptionsModal
        isOpen={optionsModal.isOpen}
        onClose={optionsModal.close}
        clearMessages={clearMessages}
        openRecipeModal={recipeModal.open}
        openCustomInfoModal={customInfoModal.open}
      />

      {recipeModal.isOpen && (
        <IngredientUploadModal
          isOpen={recipeModal.isOpen}
          onClose={() => {
            recipeModal.close();
            recipeModal.reset();
          }}
          state={recipeModal.state}
          setState={recipeModal.setState}
          openDetectionModal={detectionModal.open}
          setIngredients={(ingredients) => {
            detectionModal.setState((prevState) => ({
              ...prevState,
              ingredients: Array.isArray(ingredients) ? ingredients : [],
            }));
          }}
        />
      )}

      {detectionModal.isOpen && (
        <RecipeRecommendationModal
          isOpen={detectionModal.isOpen}
          onClose={detectionModal.close}
          ingredients={detectionModal.state.ingredients}
          setIngredients={(ingredients) => {
            detectionModal.setState((prevState) => ({
              ...prevState,
              ingredients: Array.isArray(ingredients) ? ingredients : [],
            }));
          }}
          detectedImageSrc={recipeModal.state.previewUrl || undefined}
          addMessage={addMessage}
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
