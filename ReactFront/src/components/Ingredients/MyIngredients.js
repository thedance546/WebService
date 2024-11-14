// src/components/Ingredients/MyIngredients.js
import React, { useState } from 'react';
import FileUploader from './FileUploader';
import PhotoTypeOptions from './PhotoTypeOptions';
import RecognitionResultModal from './RecognitionResultModal';
import LoadingModal from './LoadingModal';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container text-center my-ingredients">
      <h2 className="my-3">나의 식재료</h2>

      <button
        className="btn btn-success rounded-circle"
        style={{ position: 'fixed', bottom: '100px', right: '20px', width: '60px', height: '60px', fontSize: '2em' }}
        onClick={() => setShowModal(true)}
      >
        +
      </button>

      {showModal && !recognitionResult && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <h3>사진 업로드</h3>
              <FileUploader selectedFile={selectedFile} onFileChange={handleFileChange} />
              <PhotoTypeOptions selectedType={photoType} onTypeChange={handlePhotoTypeChange} />
              <div className="d-flex justify-content-around mt-3">
                <button className="btn btn-success" onClick={handleUploadConfirm}>확인</button>
                <button className="btn btn-danger" onClick={handleUploadCancel}>취소</button>
              </div>
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
