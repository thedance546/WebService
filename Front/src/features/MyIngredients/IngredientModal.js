// src/features/MyIngredients/IngredientModal.js
import React from 'react';
import FileUploader from './FileUploader';
import PhotoTypeOptions from './PhotoTypeOptions';

const IngredientModal = ({ onConfirm, onCancel, selectedFile, fileChangeHandler, photoType, photoTypeChangeHandler }) => {
  return (
    <div className="modal show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h3>식재료 등록</h3>

          <FileUploader selectedFile={selectedFile} onFileChange={fileChangeHandler} />
          <PhotoTypeOptions selectedType={photoType} onTypeChange={photoTypeChangeHandler} />

          <div className="d-flex justify-content-around mt-3">
            <button className="btn btn-success" onClick={onConfirm}>확인</button>
            <button className="btn btn-danger" onClick={onCancel}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientModal;
