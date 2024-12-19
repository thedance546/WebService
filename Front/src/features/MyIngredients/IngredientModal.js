// src/features/MyIngredients/IngredientModal.js

import React, { useState } from 'react';
import Modal from '../../components/molecules/Modal';
import FileUploader from '../../components/molecules/FileUploader';
import PhotoTypeOptions from './PhotoTypeOptions';

const IngredientModal = ({ onConfirm, onCancel, selectedFile, fileChangeHandler, photoType, photoTypeChangeHandler }) => {
  const [localSelectedFile, setLocalSelectedFile] = useState(selectedFile);
  const [localPreview, setLocalPreview] = useState(selectedFile ? URL.createObjectURL(selectedFile) : null);
  const [localPhotoType, setLocalPhotoType] = useState(photoType);

  const handleFileChange = (file) => {
    setLocalSelectedFile(file);
    setLocalPreview(file ? URL.createObjectURL(file) : null);
    fileChangeHandler(file); // 부모 상태 업데이트
  };

  const handlePhotoTypeChange = (type) => {
    setLocalPhotoType(type);
    photoTypeChangeHandler(type);
  };

  return (
    <Modal title="식재료 등록" onClose={onCancel}>
      <FileUploader onFileSelect={handleFileChange} />
      {localPreview && <img src={localPreview} alt="미리보기" className="img-fluid rounded mt-3" />}
      <PhotoTypeOptions selectedType={localPhotoType} onTypeChange={handlePhotoTypeChange} />
      <div className="d-flex justify-content-around mt-3">
        <button
          className="btn btn-success"
          onClick={() => onConfirm(localSelectedFile, localPhotoType)}
        >
          확인
        </button>
        <button className="btn btn-danger" onClick={onCancel}>취소</button>
      </div>
    </Modal>
  );
};

export default IngredientModal;
