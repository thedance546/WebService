// src/features/ChatBot/RecipeRecommendationModal.tsx

import React from 'react';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import ImageUploadPreview from '../../components/molecules/ImageUploadPreview';
import Button from '../../components/atoms/Button';

interface DetectionResult {
  objects: { name: string; confidence: number }[];
}

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

  return (
    isOpen && (
      <FullScreenOverlay
        title="레시피 추천"
        onClose={onClose}
        headerStyle={{ backgroundColor: '#007bff', color: '#fff' }}
      >
        <ImageUploadPreview onFileSelect={handleFileChange} />

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
      </FullScreenOverlay>
    )
  );
};

export default RecipeRecommendationModal;
