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
import { useChatbotContext } from '../../contexts/ChatbotContext';
import { fetchRecipeRecommendation } from '../../services/ServiceApi';
import { Sender } from '../../types/FeatureTypes'
import LoadingModal from '../../components/organisms/LoadingModal';
import botAvatar from '../../assets/matjipsa_logo.webp';

interface RecipeRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

const RecipeRecommendationModal: React.FC<RecipeRecommendationModalProps> = ({
  isOpen,
  onClose,
  ingredients,
  setIngredients,
}) => {
  const { imageData, addMessage } = useChatbotContext();
  const { ingredients: storedIngredients } = useIngredients();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [additionalRequest, setAdditionalRequest] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedData = localStorage.getItem(StorageKeys.USER_INFO);
    if (savedData) {
      setUserInfo(JSON.parse(savedData));
    }
  }, []);

  const handleSubmit = async () => {
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

    try {
      setLoading(true); // 로딩 시작
      const response = await fetchRecipeRecommendation(payload);
      console.log('레시피 추천 응답:', response);

      if (imageData) {
        addMessage({
          sender: Sender.User,
          text: '',
          attachedImage: imageData,
        });
      }

      if (response) {
        addMessage({
          sender: Sender.Bot,
          text: response.contents,
          profileImage: botAvatar,
          formatted: true,
        });
      }

    } catch (error) {
      console.error('레시피 추천 요청 실패:', error);
      alert('레시피 추천 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <FullScreenOverlay title="레시피 추천 받기" onClose={onClose}>
        <div className="mb-3">
          {imageData ? (
            <ImagePreview
              src={imageData}
              alt="탐지된 이미지"
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
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? '요청 중...' : '레시피 추천 받기'}
          </Button>
        </div>
      </FullScreenOverlay>

      {loading && <LoadingModal />} {/* 로딩 모달 조건부 렌더링 */}
    </>
  );
};

export default RecipeRecommendationModal;
