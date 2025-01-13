// src/features/ChatBot/IngredientUploadModal.tsx

import React from 'react';
import Modal from '../../components/molecules/Modal';
import ImageUploadPreview from '../../components/molecules/ImageUploadPreview';
import Button from '../../components/atoms/Button';
import { detectObjectsInImage } from '../../services/ServiceApi';
import { Ingredient } from '../../types/EntityTypes';

interface IngredientUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: {
    selectedFile: File | null;
    detectionResult: any;
    previewUrl: string | null;
    loading: boolean;
  };
  setState: React.Dispatch<
    React.SetStateAction<{
      selectedFile: File | null;
      detectionResult: any;
      previewUrl: string | null;
      loading: boolean;
    }>
  >;
  openDetectionModal: () => void;
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

const IngredientUploadModal: React.FC<IngredientUploadModalProps> = ({
  onClose,
  state,
  setState,
  openDetectionModal,
  setIngredients,
}) => {
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
      const { detectionResults, imageData } = await detectObjectsInImage(state.selectedFile);
  
      console.log('Received imageData:', imageData);
  
      const parsedIngredients = Object.entries(detectionResults).map(([name, quantity]) => ({
        ingredientId: Date.now() + Math.floor(Math.random() * 1000),
        name,
        quantity: parseInt(quantity, 10),
      }));
  
      setIngredients(parsedIngredients);
      setState((prevState) => ({
        ...prevState,
        detectionResult: detectionResults,
        previewUrl: imageData,
      }));
  
      openDetectionModal();
      onClose();
    } catch (error) {
      console.error('Detection failed:', error);
      alert('이미지 인식 중 오류가 발생했습니다.');
    } finally {
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
        placeholderMessage="레시피에 쓰고 싶은 식재료 이미지를 업로드해주세요."
      />
      <Button onClick={handleDetection} disabled={state.loading}>
        {state.loading ? '분석 중...' : '재료 확인 하기'}
      </Button>
    </Modal>
  );
};

export default IngredientUploadModal;