// src/features/ChatBot/RecipeRecommendationModal.tsx

import React from 'react';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import EditIngredientForm from '../../components/organisms/EditIngredientForm';
import ImagePreview from '../../components/atoms/ImagePreview';
import { Ingredient } from '../../types/EntityTypes';

interface RecipeRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  detectedImageSrc?: string;
}

const RecipeRecommendationModal: React.FC<RecipeRecommendationModalProps> = ({
  isOpen,
  onClose,
  ingredients,
  setIngredients,
  detectedImageSrc,
}) => {
  if (!isOpen) return null;

  return (
    <FullScreenOverlay title="레시피 추천 받기기" onClose={onClose}>
      <div className="mb-3">
        <ImagePreview
          src={detectedImageSrc}
          alt="탐지된 이미지 미리보기"
          style={{ height: '400px', width: '100%' }}
        />
      </div>
      <EditIngredientForm ingredients={ingredients} onIngredientsChange={setIngredients} />
    </FullScreenOverlay>
  );
};

export default RecipeRecommendationModal;
