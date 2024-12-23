// src/features/ChatBot/RecipeRecommendationModal.tsx

import React, { useState } from 'react';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import ImageUploadPreview from '../../components/molecules/ImageUploadPreview';
import Button from '../../components/atoms/Button';

interface DetectionObject {
  name: string;
  confidence: number;
}

interface DetectionResult {
  objects: DetectionObject[];
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
  const [editedResult, setEditedResult] = useState<DetectionObject[]>([]);

  const handleFileChange = (file: File) => {
    setState((prevState) => ({ ...prevState, selectedFile: file }));
  };

  const handleChange = <K extends keyof DetectionObject>(
    index: number,
    field: K,
    value: DetectionObject[K]
  ) => {
    const updated = [...editedResult];
    updated[index][field] = value; // 수정된 부분
    setEditedResult(updated);
  };

  const handleDetection = async () => {
    if (!state.selectedFile) {
      alert('이미지를 업로드해주세요.');
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true }));

    setTimeout(() => {
      const detectionResult: DetectionResult = {
        objects: [
          { name: 'Tomato', confidence: 0.95 },
          { name: 'Carrot', confidence: 0.89 },
        ],
      };
      setState((prevState) => ({
        ...prevState,
        detectionResult,
        loading: false,
      }));
      setEditedResult(detectionResult.objects); // 탐지 결과를 상태에 설정
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
