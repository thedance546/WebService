// src/features/ChatBot/RecipeRecommendationModal.js

import React from 'react';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';

const RecipeRecommendationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <FullScreenOverlay
      title="레시피 추천"
      onClose={onClose}
      headerStyle={{ backgroundColor: '#007bff', color: '#fff' }}
    >
      <p>AI가 추천하는 레시피를 확인하세요!</p>
      {/* 레시피 목록 또는 추가 UI를 여기에 배치 */}
    </FullScreenOverlay>
  );
};

export default RecipeRecommendationModal;
