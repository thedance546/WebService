// src/features/MyIngredients/IngredientModal.js

import React, { useState } from 'react';
import Modal from '../../components/molecules/Modal';
import FileUploader from '../../components/molecules/FileUploader';
import PhotoTypeOptions from './PhotoTypeOptions';

const IngredientModal = ({ onConfirm, onCancel, selectedFile, fileChangeHandler, photoType, photoTypeChangeHandler }) => {
  const [localFile, setLocalFile] = useState(selectedFile);
  const [localPhotoType, setLocalPhotoType] = useState(photoType);

  const handleFileChange = (file) => {
    setLocalFile(file);
    fileChangeHandler(file);
  };

  const handlePhotoTypeChange = (type) => {
    setLocalPhotoType(type);
    photoTypeChangeHandler(type);
  };

  return (
    <Modal title="식재료 등록" onClose={onCancel}>
      <FileUploader onFileSelect={handleFileChange} />
      <PhotoTypeOptions selectedType={localPhotoType} onTypeChange={handlePhotoTypeChange} />
      <div className="d-flex justify-content-around mt-3">
        <button
          className="btn btn-success"
          onClick={() => onConfirm(localFile, localPhotoType)}
        >
          확인
        </button>
        <button className="btn btn-danger" onClick={onCancel}>취소</button>
      </div>
    </Modal>
  );
};

export default IngredientModal;
