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
import { Sender, Message } from '../../types/FeatureTypes';

interface RecipeRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  detectedImageSrc?: string;
  addMessage: (message: Message) => void;
}

const RecipeRecommendationModal: React.FC<RecipeRecommendationModalProps> = ({
  isOpen,
  onClose,
  ingredients,
  setIngredients,
  detectedImageSrc,
  addMessage,
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

  const handleOpenInNewTab = () => {
    if (detectedImageSrc) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(
          `<img src="${detectedImageSrc}" alt="Detected Image" style="width:100%; height:auto;" />`
        );
        newWindow.document.title = 'YOLO Detection Result';
      } else {
        alert('팝업 차단을 해제해주세요.');
      }
    } else {
      console.warn('detectedImageSrc is not available');
    }
  };
  
  const handleDownload = () => {
    if (detectedImageSrc) {
      const link = document.createElement('a');
      link.href = detectedImageSrc;
      link.download = 'yolo_detection_result.jpg'; // 다운로드 파일명 지정
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <FullScreenOverlay title="레시피 추천 받기" onClose={onClose}>
      <div className="mb-3">
        {detectedImageSrc ? (
          <ImagePreview
            src={detectedImageSrc}
            alt="탐지된 이미지 미리보기"
            style={{ height: '400px', width: '100%' }}
          />
        ) : (
          <p>이미지가 없습니다.</p>
        )}
      </div>

      <div className="d-flex justify-content-start mb-3">
        <Button variant="secondary" onClick={handleOpenInNewTab} className="me-2">
          새 탭에서 보기
        </Button>
        <Button variant="secondary" onClick={handleDownload}>
          다운로드
        </Button>
      </div>
      
      <Button
        variant="primary"
        onClick={() => {
          addMessage({
            sender: Sender.User,
            text: '탐지된 식재료를 확인하세요.',
            attachedImage: detectedImageSrc,
          });
          onClose();
        }}
      >
        확인
      </Button>

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
          placeholder="추가 요청사항을 입력하세요"
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
