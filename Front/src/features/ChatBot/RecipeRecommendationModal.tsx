// src/features/ChatBot/RecipeRecommendationModal.tsx

import React from 'react';
import Modal from '../../components/molecules/FullScreenOverlay';
import ImageUploadPreview from '../../components/molecules/ImageUploadPreview';
import Button from '../../components/atoms/Button';
import { DetectionResult } from '../../types/FeatureTypes';

interface RecipeRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: {
    selectedFile: File | null;
    detectionResult: DetectionResult | null;
    loading: boolean;
  };
  setState: React.Dispatch<
    React.SetStateAction<{
      selectedFile: File | null;
      detectionResult: DetectionResult | null;
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
  const handleFileChange = (file: File) => {
    setState((prevState) => ({ ...prevState, selectedFile: file }));
  };

  const handleDetection = async () => {
    if (!state.selectedFile) {
      alert('이미지를 업로드해주세요.');
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true }));

    // 테스트용 코드: 실제 API 호출 대신 가짜 결과를 반환
    setTimeout(() => {
      setState({
        selectedFile: state.selectedFile,
        detectionResult: {
          objects: [
            { name: 'Tomato', confidence: 0.95 },
            { name: 'Carrot', confidence: 0.89 },
          ],
        },
        loading: false,
      });
    }, 2000);
  };

  if (!isOpen) {
    return null; // isOpen이 false인 경우 null 반환
  }

  return (
    <Modal
      title="레시피 추천 받기"
      onClose={onClose}
    >
      <ImageUploadPreview
        onFileSelect={handleFileChange}
        previewStyle={{ minHeight: '300px', maxHeight: '300px', maxWidth: '100%' }}
        placeholderMessage="식재료 이미지를 업로드해주세요. 탐지된 식재료를 바탕으로 레시피를 추천해 드립니다."
      />

      <div className="d-flex flex-column align-items-center">
        {state.detectionResult && (
          <div className="mb-3">
            <h6>탐지된 객체</h6>
            <pre>{JSON.stringify(state.detectionResult.objects, null, 2)}</pre>
          </div>
        )}
      </div>

      <Button
        onClick={handleDetection}
        className="btn btn-primary mb-3"
        disabled={state.loading}
      >
        {state.loading ? '처리 중...' : '객체 탐지 시작'}
      </Button>
    </Modal>
  );
};

export default RecipeRecommendationModal;
