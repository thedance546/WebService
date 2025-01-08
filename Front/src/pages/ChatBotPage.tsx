// src/pages/ChatBotPage.tsx

import React, { useState } from 'react';
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
import Modal from '../components/molecules/Modal';
import Button from '../components/atoms/Button';
import botAvatar from '../assets/matjipsa_logo.png';

const ChatBotPage: React.FC = () => {
  const initialMessage: Message[] = [
    { sender: Sender.Bot, text: '안녕하세요! 무엇을 도와드릴까요?', imageUrl: botAvatar },
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
    loading: false,
  });
  const detectionModal = usePopupState({
    isOpen: false,
    ingredients: [] as Ingredient[],
  });
  const customInfoModal = usePopupState({ isOpen: false });

  const imageUploadModal = usePopupState({
    selectedFile: null as File | null,
    previewUrl: null as string | null,
  });

  const clearMessages = () => {
    setMessages(initialMessage);
    localStorage.removeItem('chatMessages');
  };

  const handleImageUpload = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    imageUploadModal.setState({ selectedFile: file, previewUrl });
  };

  const addImageMessage = () => {
    if (imageUploadModal.state.previewUrl) {
      addMessage({
        sender: Sender.User,
        text: '',
        imageUrl: imageUploadModal.state.previewUrl,
      });
      imageUploadModal.reset();
    }
  };

  return (
    <div className="container">
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
        onImagePreviewTest={imageUploadModal.open}
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
        />
      )}
      {imageUploadModal.isOpen && (
        <Modal title="이미지 업로드 테스트" onClose={imageUploadModal.close}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
          />
          {imageUploadModal.state.previewUrl && (
            <img
              src={imageUploadModal.state.previewUrl}
              alt="Preview"
              style={{ width: '100%', height: 'auto', marginTop: '1rem' }}
            />
          )}
          <Button onClick={addImageMessage} disabled={!imageUploadModal.state.previewUrl}>
            전송
          </Button>
        </Modal>
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
