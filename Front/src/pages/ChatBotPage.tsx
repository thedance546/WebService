// src/pages/ChatBotPage.tsx

import React from 'react';
import CommonHeader from "../components/organisms/CommonHeader";
import ChatMessages from '../features/ChatBot/ChatMessages';
import ChatInput from '../features/ChatBot/ChatInput';
import OptionsModal from '../features/ChatBot/ChatBotOptionsModal';
import IngredientUploadModal from '../features/ChatBot/IngredientUploadModal';
import CustomInfoInputModal from '../features/ChatBot/CustomInfoInputModal';
import RecipeRecommendationModal from '../features/ChatBot/RecipeRecommendationModal';
import HomeNavBar from '../components/organisms/HomeNavBar';
import { usePopupState } from '../hooks/usePopupState';
import { Sender } from '../types/FeatureTypes';
import { useChatbotContext } from '../contexts/ChatbotContext';
import { Ingredient } from '../types/EntityTypes';

const ChatBotPage: React.FC = () => {
  const { imageData, setImageData, messages, addMessage, clearMessages } = useChatbotContext();

  const optionsModal = usePopupState({ isOpen: false });
  const uploadModal = usePopupState({
    selectedFile: null as File | null,
    detectionResult: null as any,
    loading: false,
  });
  const recommendModal = usePopupState<{
    isOpen: boolean;
    ingredients: Ingredient[];
  }>({
    isOpen: false,
    ingredients: [],
  });
  const customInfoModal = usePopupState({ isOpen: false });

  const handleRecommendModalClose = () => {
    if (imageData) {
      addMessage({
        sender: Sender.User,
        text: '',
        attachedImage: imageData,
      });
      setImageData(null);
    }
    recommendModal.close();
  };

  return (
    <div className="container">
      <CommonHeader pageTitle="챗봇" />

      <ChatMessages messages={messages} />

      <ChatInput toggleOptions={optionsModal.open} disabled={optionsModal.isOpen} />

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
