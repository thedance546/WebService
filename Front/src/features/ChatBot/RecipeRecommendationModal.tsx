// src/features/ChatBot/RecipeRecommendationModal.tsx

import React from 'react';
import Modal from '../../components/molecules/FullScreenOverlay';
import ImageUploadPreview from '../../components/molecules/ImageUploadPreview';
import Button from '../../components/atoms/Button';
import { detectObjectsInImage } from '../../services/DetectionApi';

interface RecipeRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: {
    selectedFile: File | null;
    detectionResult: any; // 서버 응답 데이터 그대로 사용
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
  const handleFileChange = (file: File) => {
    setState((prevState) => ({ ...prevState, selectedFile: file }));
  };

  const handleDetection = async () => {
    if (!state.selectedFile) {
      alert('이미지를 업로드해주세요.');
      return;
    }

    console.log('[RecipeRecommendationModal] 탐지 요청 시작: 선택된 파일 -', state.selectedFile.name);

    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const detectionResult = await detectObjectsInImage(state.selectedFile);

      console.log('[RecipeRecommendationModal] 탐지 결과:', detectionResult);

      setState({
        selectedFile: state.selectedFile,
        detectionResult: detectionResult, // 서버 응답 그대로 저장
        loading: false,
      });
    } catch (error) {
      console.error('[RecipeRecommendationModal] 탐지 중 오류 발생:', (error as Error).message);
      alert('탐지 중 오류가 발생했습니다.');
      setState((prevState) => ({ ...prevState, loading: false }));
    }

    const blob = new Blob([state.selectedFile], { type: state.selectedFile?.type });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank'); // 이미지를 새 탭에서 확인
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      title="레시피 추천 받기"
      onClose={onClose}
    >
      <ImageUploadPreview
        onFileSelect={handleFileChange}
        previewStyle={{
          width: '100%',
          height: '400px',
        }}
        placeholderMessage="식재료 이미지를 업로드해주세요. 탐지된 식재료를 바탕으로 레시피를 추천해 드립니다."
      />

      <div className="d-flex flex-column align-items-center">
        {state.detectionResult && (
          <div className="mb-3">
            <h6>탐지 결과</h6>
            <pre>{JSON.stringify(state.detectionResult, null, 2)}</pre> {/* 서버 응답 데이터를 그대로 출력 */}
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
