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
import { useImageContext } from '../contexts/ChatbotContext';

const ChatBotPage: React.FC = () => {
  const initialMessage: Message[] = [
    { sender: Sender.Bot, text: '안녕하세요! 맛집사 챗봇입니다!\n식재료 정보나 관리에 대해 물어보세요\nAI 레시피 추천은 옵션에서 할 수 있습니다', profileImage: botAvatar },
  ];
  const { imageData, setImageData } = useImageContext();

  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : initialMessage;
  });

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const optionsModal = usePopupState({ isOpen: false });
  const uploadModal = usePopupState({
    selectedFile: null as File | null,
    detectionResult: null as any,
    loading: false,
  });
  const recommendModal = usePopupState({
    isOpen: false,
    ingredients: [] as Ingredient[],
  });
  const customInfoModal = usePopupState({ isOpen: false });

  const clearMessages = () => {
    setMessages(initialMessage);
    localStorage.removeItem('chatMessages');
  };

  const handleRecommendModalClose = () => {
    if (imageData) {
      // 채팅에 이미지 추가
      addMessage({
        sender: Sender.User,
        text: '', // 텍스트는 비워둠
        attachedImage: imageData, // 컨텍스트의 이미지 사용
      });
      setImageData(''); // 이미지 초기화
    }
    recommendModal.close(); // 모달 닫기
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
        openRecipeModal={uploadModal.open}
        openCustomInfoModal={customInfoModal.open}
      />

      {uploadModal.isOpen && (
        <IngredientUploadModal
          isOpen={uploadModal.isOpen}
          onClose={() => {
            uploadModal.close();
            uploadModal.reset();
          }}
          state={uploadModal.state}
          setState={uploadModal.setState}
          openDetectionModal={recommendModal.open}
          setIngredients={(ingredients) => {
            recommendModal.setState((prevState) => ({
              ...prevState,
              ingredients: Array.isArray(ingredients) ? ingredients : [],
            }));
          }}
        />
      )}

      {recommendModal.isOpen && (
        <RecipeRecommendationModal
          isOpen={recommendModal.isOpen}
          onClose={handleRecommendModalClose}
          ingredients={recommendModal.state.ingredients}
          setIngredients={(ingredients) => {
            recommendModal.setState((prevState) => ({
              ...prevState,
              ingredients: Array.isArray(ingredients) ? ingredients : [],
            }));
          }}
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
