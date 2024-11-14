// src/components/Ingredients/MyIngredients.js

import React, { useState } from 'react';
import './MyIngredientsCommon.css'; // 공통 스타일
import FileUploader from './FileUploader';
import PhotoTypeOptions from './PhotoTypeOptions';
import RecognitionResultModal from './RecognitionResultModal';
import LoadingModal from './LoadingModal';

const MyIngredients = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoType, setPhotoType] = useState('');
  const [recognitionResult, setRecognitionResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file ? URL.createObjectURL(file) : null);
  };

  const handlePhotoTypeChange = (event) => {
    setPhotoType(event.target.value);
  };

  const handleUploadCancel = () => {
    setSelectedFile(null);
    setPhotoType('');
    setShowModal(false);
  };

  const handleUploadConfirm = async () => {
    if (!selectedFile || !photoType) {
      alert('사진과 타입을 선택해주세요.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setRecognitionResult({
        resultImage: selectedFile,
        resultList: ['사과', '오렌지', '바나나'],
      });
    }, 3000);
  };

  const handleResultModalClose = () => {
    setRecognitionResult(null);
    setShowModal(false);
  };

  return (
    <div className="my-ingredients">
      <h2>나의 식재료</h2>

      <button className="upload-button" onClick={() => setShowModal(true)}>
        +
      </button>

      {showModal && !recognitionResult && (
        <div className="modal">
          <div className="modal-content">
            <h3>사진 업로드</h3>
            <FileUploader selectedFile={selectedFile} onFileChange={handleFileChange} />
            <PhotoTypeOptions selectedType={photoType} onTypeChange={handlePhotoTypeChange} />
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleUploadConfirm}>확인</button>
              <button className="cancel-button" onClick={handleUploadCancel}>취소</button>
            </div>
          </div>
        </div>
      )}

      {recognitionResult && (
        <RecognitionResultModal result={recognitionResult} onClose={handleResultModalClose} />
      )}

      {loading && <LoadingModal />}
    </div>
  );
};

export default MyIngredients;
