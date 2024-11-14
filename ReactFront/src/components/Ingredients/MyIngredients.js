// src/components/Ingredients/MyIngredients.js
import React, { useState, useEffect } from 'react';
import IngredientModal from './IngredientModal';
import RecognitionResultModal from './RecognitionResultModal';
import LoadingModal from './LoadingModal';

const MyIngredients = ({ showModal, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoType, setPhotoType] = useState('');
  const [recognitionResult, setRecognitionResult] = useState(null);

  // 모달 초기화 함수
  const resetModal = () => {
    setSelectedFile(null);
    setPhotoType('');
  };

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file ? URL.createObjectURL(file) : null);
  };

  // 이미지 타입 선택 핸들러
  const handlePhotoTypeChange = (event) => {
    setPhotoType(event.target.value);
  };

  const handleUploadCancel = () => {
    resetModal();
    closeModal();
  };

  const handleUploadConfirm = async () => {
    if (!selectedFile || !photoType) {
      alert('사진과 이미지 타입을 선택해주세요.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setRecognitionResult({
        resultImage: selectedFile,
        resultList: ['사과', '오렌지', '바나나'],
      });
      resetModal();
    }, 3000);
  };

  const handleResultModalClose = () => {
    setRecognitionResult(null);
    closeModal();
  };

  useEffect(() => {
    if (!showModal) {
      resetModal();
    }
  }, [showModal]);

  return (
    <div className="container text-center my-ingredients">
      <h2 className="my-3">나의 식재료</h2>

      {/* 식재료 등록 모달 */}
      {showModal && !recognitionResult && (
        <IngredientModal
          onConfirm={handleUploadConfirm}
          onCancel={handleUploadCancel}
          selectedFile={selectedFile}
          fileChangeHandler={handleFileChange}
          photoType={photoType}
          photoTypeChangeHandler={handlePhotoTypeChange}
        />
      )}

      {/* 인식 결과 모달 */}
      {recognitionResult && (
        <RecognitionResultModal result={recognitionResult} onClose={handleResultModalClose} />
      )}

      {/* 로딩 모달 */}
      {loading && <LoadingModal />}
    </div>
  );
};

export default MyIngredients;
