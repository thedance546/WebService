// src/features/ChatBot/RecipeRecommendationModal.js

import React, { useState } from 'react';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import FileUploader from '../../components/molecules/FileUploader';
import Button from '../../components/atoms/Button';

const RecipeRecommendationModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const handleDetection = async () => {
    if (!selectedFile) {
      alert('이미지를 업로드해주세요.');
      return;
    }

    setLoading(true);

    // 테스트용 코드: 실제 API 호출 대신 가짜 결과를 반환
    setTimeout(() => {
      const fakeResult = {
        processedImage: 'https://via.placeholder.com/400x300.png?text=Detection+Result',
        objects: [
          { name: 'Tomato', confidence: 0.95 },
          { name: 'Carrot', confidence: 0.89 },
        ],
      };
      setDetectionResult(fakeResult);
      setLoading(false);
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
          {detectionResult ? (
            <div className="mb-3">
              <h5>탐지 결과 이미지</h5>
              <img
                src={detectionResult.processedImage}
                alt="객체 탐지 결과"
                className="img-fluid mb-3"
              />
              <h6>탐지된 객체</h6>
              <pre>{JSON.stringify(detectionResult.objects, null, 2)}</pre>
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
          disabled={loading}
        >
          {loading ? '처리 중...' : '객체 탐지 시작'}
        </Button>
      </FullScreenOverlay>
    )
  );
};

export default RecipeRecommendationModal;
