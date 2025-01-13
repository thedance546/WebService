// src/features/ChatBot/RecipeRecommendationModal.tsx

import React, { useEffect, useState } from 'react';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import EditIngredientForm from '../../components/organisms/EditIngredientForm';
import StoredIngredientsList from '../../features/ChatBot/StoredIngredientsList';
import UserPreferencesCard from '../../features/ChatBot/UserPreferencesCard';
import ImagePreview from '../../components/atoms/ImagePreview';
import { useIngredients } from '../../contexts/IngredientsContext';
import { Ingredient } from '../../types/EntityTypes';
import { StorageKeys } from '../../constants/StorageKey';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { useImageContext } from '../../contexts/ChatbotContext';

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
  const { imageData } = useImageContext();
  const { ingredients: storedIngredients } = useIngredients();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [additionalRequest, setAdditionalRequest] = useState<string>('');

  useEffect(() => {
    const savedData = localStorage.getItem(StorageKeys.USER_INFO);
    if (savedData) {
      setUserInfo(JSON.parse(savedData));
    }
    console.log('Received detectedImageSrc in RecipeRecommendationModal:', detectedImageSrc);
  }, [detectedImageSrc]);

  const handleSubmit = () => {
    if (!userInfo) {
      alert("사용자 정보를 입력해주세요.");
      return;
    }

    const mergedFoodCategories = [
      ...userInfo.foodCategories,
      ...(userInfo.customFoodCategory ? [userInfo.customFoodCategory] : []),
    ];

    const mergedAllergies = [
      ...userInfo.allergies,
      ...(userInfo.customAllergy ? [userInfo.customAllergy] : []),
    ];

    const sanitizedDetectedIngredients = ingredients.map(({ name, quantity }) => ({
      name,
      quantity,
    }));

    const sanitizedStoredIngredients = selectedIngredients.map(({ name, quantity, shelfLife, consumeBy }) => ({
      name,
      quantity,
      shelfLife,
      consumeBy,
    }));

    const payload = {
      detectedIngredients: sanitizedDetectedIngredients,
      selectedStoredIngredients: sanitizedStoredIngredients,
      userPreferences: {
        ...userInfo,
        foodCategories: mergedFoodCategories,
        allergies: mergedAllergies,
      },
      additionalRequest,
    };

    delete payload.userPreferences.customFoodCategory;
    delete payload.userPreferences.customAllergy;

    console.log("API 호출 데이터:", JSON.stringify(payload, null, 2));
    alert("레시피 추천이 요청되었습니다.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <FullScreenOverlay title="레시피 추천 받기" onClose={onClose}>
      <div className="mb-3">
        {imageData ? (
          <ImagePreview
            src={imageData}
            alt="탐지된 이미지 미리보기"
            style={{ height: '400px', width: '100%' }}
          />
        ) : (
          <p>이미지가 없습니다.</p>
        )}
      </div>

      <EditIngredientForm ingredients={ingredients} onIngredientsChange={setIngredients} />
      <StoredIngredientsList
        ingredients={storedIngredients}
        onSelectionChange={setSelectedIngredients}
      />
      {userInfo && <UserPreferencesCard userInfo={userInfo} />}
      <div className="mt-3">
        <h5>추가 요청사항</h5>
        <Input
          value={additionalRequest}
          onChange={(e) => setAdditionalRequest(e.target.value)}
          placeholder="ex) 어떤 재료를 많이 써줘, 매운맛이 강한 음식 추천 등"
        />
      </div>
      <div className="mt-4 d-flex justify-content-end">
        <Button variant="primary" onClick={handleSubmit}>
          레시피 추천 받기
        </Button>
      </div>
    </FullScreenOverlay>
  );
};

export default RecipeRecommendationModal;
