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
  const { ingredients: storedIngredients } = useIngredients();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [additionalRequest, setAdditionalRequest] = useState<string>('');

  useEffect(() => {
    const savedData = localStorage.getItem(StorageKeys.USER_INFO);
    if (savedData) {
      setUserInfo(JSON.parse(savedData));
    }
  }, []);

  const handleSubmit = () => {
    if (!userInfo) return;

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

    console.log(JSON.stringify(payload, null, 2));
  };



  if (!isOpen) return null;

  return (
    <FullScreenOverlay title="레시피 추천 받기" onClose={onClose}>
      {/* 이미지 미리보기 */}
      <div className="mb-3">
        <ImagePreview
          src={detectedImageSrc}
          alt="탐지된 이미지 미리보기"
          style={{ height: '400px', width: '100%' }}
        />
      </div>

      {/* 재료 편집 폼 */}
      <EditIngredientForm ingredients={ingredients} onIngredientsChange={setIngredients} />

      {/* 저장된 식재료 */}
      <StoredIngredientsList
        ingredients={storedIngredients}
        onSelectionChange={setSelectedIngredients}
      />

      {/* 사용자 맞춤 정보 */}
      {userInfo && <UserPreferencesCard userInfo={userInfo} />}

      {/* 추가 요청사항 */}
      <div className="mt-3">
        <h5>추가 요청사항</h5>
        <Input
          value={additionalRequest}
          onChange={(e) => setAdditionalRequest(e.target.value)}
          placeholder="추가 요청사항을 입력하세요"
        />
      </div>

      {/* 제출 버튼 */}
      <div className="mt-4 d-flex justify-content-end">
        <Button variant="primary" onClick={handleSubmit}>
          레시피 추천 받기
        </Button>
      </div>
    </FullScreenOverlay>
  );
};

export default RecipeRecommendationModal;
