// src/features/MyIngredients/IngredientModal.js
import React from 'react';
import Modal from '../../components/atoms/Modal';
import FileUploader from './FileUploader';
import PhotoTypeOptions from './PhotoTypeOptions';

const IngredientModal = ({ onConfirm, onCancel, selectedFile, fileChangeHandler, photoType, photoTypeChangeHandler }) => {
  return (
    <Modal title="식재료 등록" onClose={onCancel}>
      <FileUploader selectedFile={selectedFile} onFileChange={fileChangeHandler} />
      <PhotoTypeOptions selectedType={photoType} onTypeChange={photoTypeChangeHandler} />
      <div className="d-flex justify-content-around mt-3">
        <button className="btn btn-success" onClick={onConfirm}>확인</button>
        <button className="btn btn-danger" onClick={onCancel}>취소</button>
      </div>
    </Modal>
  );
};

export default IngredientModal;
