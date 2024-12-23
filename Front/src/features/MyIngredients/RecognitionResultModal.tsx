// src/features/ChatBot/RecipeRecommendationModal.tsx

import React, { useState } from 'react';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import ImageUploadPreview from '../../components/molecules/ImageUploadPreview';
import Button from '../../components/atoms/Button';
import { Ingredient } from '../../types/EntityTypes';

interface RecognitionResultModalProps {
  resultImage: File | null;
  resultList: Ingredient[];
  onConfirm: (editedIngredients: Ingredient[]) => void;
  onClose: () => void;
}

const RecognitionResultModal: React.FC<RecognitionResultModalProps> = ({
  resultImage,
  resultList,
  onConfirm,
  onClose,
}) => {
  const [editedResult, setEditedResult] = useState<Ingredient[]>(resultList);

  const handleEdit = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = [...editedResult];
    updated[index] = { ...updated[index], [field]: value };
    setEditedResult(updated);
  };

  const handleConfirm = () => {
    onConfirm(editedResult);
  };

  const handleDetection = () => {
    console.log('Detection started'); // 기존 탐지 관련 기능 유지
  };

  const handleFileChange = (file: File) => {
    console.log(`Selected file: ${file.name}`); // 파일 변경 기능 유지
  };

  if (!resultImage && resultList.length === 0) {
    return null; // 결과가 없을 경우 아무것도 표시하지 않음
  }

  return (
    <FullScreenOverlay
      title="인식 결과"
      onClose={onClose}
      headerStyle={{ backgroundColor: '#007bff', color: '#fff' }}
    >
      <ImageUploadPreview onFileSelect={handleFileChange} />

      {resultImage && (
        <div className="mb-3">
          <h6>인식된 이미지</h6>
          <img src={URL.createObjectURL(resultImage)} alt="Result" className="img-fluid" />
        </div>
      )}

      <div className="d-flex flex-column align-items-center">
        {editedResult.map((ingredient, index) => (
          <div key={ingredient.ingredientId} className="mb-2">
            <span>{ingredient.name}</span>
            <input
              type="number"
              value={ingredient.quantity}
              onChange={(e) => handleEdit(index, 'quantity', Number(e.target.value))}
              className="form-control"
              style={{ width: '100px', display: 'inline-block', marginLeft: '10px' }}
            />
          </div>
        ))}
      </div>

      <Button onClick={handleConfirm} className="btn btn-primary mb-3">
        확인
      </Button>
      <Button onClick={handleDetection} className="btn btn-secondary mb-3">
        탐지 시작
      </Button>
    </FullScreenOverlay>
  );
};

export default RecognitionResultModal;
