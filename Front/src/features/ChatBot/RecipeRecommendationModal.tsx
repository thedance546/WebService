// src/features/ChatBot/RecipeRecommendationModal.tsx

import React, { useState } from 'react';
import Modal from '../../components/molecules/FullScreenOverlay';
import ImageUploadPreview from '../../components/molecules/ImageUploadPreview';
import Button from '../../components/atoms/Button';
import EditIngredientForm from '../../components/organisms/EditIngredientForm';
import { detectObjectsInImage } from '../../services/YOLOApi';
import { Ingredient } from '../../types/EntityTypes';

interface RecipeRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: {
    selectedFile: File | null;
    detectionResult: any;
    loading: boolean;
  };
  setState: React.Dispatch<
    React.SetStateAction<{
      selectedFile: File | null;
      detectionResult: any;
      loading: boolean;
    }>
  >;
}

const RecipeRecommendationModal: React.FC<RecipeRecommendationModalProps> = ({
  isOpen,
  onClose,
  state,
  setState,
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const handleFileChange = (file: File) => {
    setState((prevState) => ({ ...prevState, selectedFile: file }));
  };

  const handleDetection = async () => {
    if (!state.selectedFile) {
      alert('이미지를 업로드해주세요.');
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const detectionResult = await detectObjectsInImage(state.selectedFile);
      const parsedIngredients = Object.entries(detectionResult).map(([name, quantity]) => ({
        ingredientId: Date.now() + Math.random(),
        name,
        quantity: Number(quantity),
      }));
      setIngredients(parsedIngredients);
      setState((prevState) => ({ ...prevState, loading: false }));
    } catch (error) {
      console.error(error);
      alert('탐지 중 오류가 발생했습니다.');
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  return (
    <Modal title="레시피 추천 받기" onClose={onClose}>
      <ImageUploadPreview
        onFileSelect={handleFileChange}
        previewStyle={{
          width: '100%',
          height: '400px',
        }}
        placeholderMessage="식재료 이미지를 업로드해주세요. 확인한 식재료를 바탕으로 레시피를 추천해 드립니다."
      />
      <Button onClick={handleDetection} disabled={state.loading}>
        {state.loading ? '분석 중...' : '재료 확인 하기'}
      </Button>

      {ingredients.length > 0 && (
        <EditIngredientForm
          ingredients={ingredients}
          onIngredientsChange={setIngredients}
        />
      )}
    </Modal>
  );
};

export default RecipeRecommendationModal;