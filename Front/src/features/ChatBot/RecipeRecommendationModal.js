// src/features/ChatBot/RecipeRecommendationModal.js

import React from 'react';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import FileUploader from '../../components/molecules/FileUploader';
import Button from '../../components/atoms/Button';

const RecipeRecommendationModal = ({ isOpen, onClose, state, setState }) => {
  const handleFileChange = (file) => {
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
          processedImage: 'https://via.placeholder.com/400x300.png?text=Detection+Result',
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
        <FileUploader onFileSelect={handleFileChange} />

        <div className="d-flex flex-column align-items-center">
          {/* 처리 결과 자리 */}
          {state.detectionResult ? (
            <div className="mb-3">
              <h5>탐지 결과 이미지</h5>
              <img
                src={state.detectionResult.processedImage}
                alt="객체 탐지 결과"
                className="img-fluid mb-3"
              />
              <h6>탐지된 객체</h6>
              <pre>{JSON.stringify(state.detectionResult.objects, null, 2)}</pre>
            </div>
          ) : (
            <div className="mb-3" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', border: '1px dashed #ced4da' }}>
              <span>탐지 결과가 여기에 표시됩니다.</span>
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
