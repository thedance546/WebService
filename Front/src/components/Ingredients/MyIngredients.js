// src/components/Ingredients/MyIngredients.js

import React, { useState, useEffect } from 'react';
import IngredientModal from './IngredientModal';
import RecognitionResultModal from './RecognitionResultModal';
import LoadingModal from './LoadingModal';
import { Plus } from 'react-bootstrap-icons';

const MyIngredients = ({ showModal, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoType, setPhotoType] = useState('');
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

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
    setIsModalOpen(false);
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
      setIsModalOpen(false);
    }, 3000);
  };

  const handleResultModalClose = () => {
    setRecognitionResult(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      resetModal();
    }
  }, [isModalOpen]);

  return (
    <div className="container text-center my-ingredients">
      <h2 className="my-3">나의 식재료</h2>

      {/* 식재료 추가 버튼 (FAB) */}
      <button
        className="btn btn-success position-fixed"
        style={{
          bottom: '80px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
        }}
        onClick={() => setIsModalOpen(true)} // FAB 버튼 클릭 시 모달 열기
      >
        <Plus size={28} />
      </button>

      {/* 식재료 등록 모달 */}
      {isModalOpen && !recognitionResult && (
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
