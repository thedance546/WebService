// src/features/MyIngredients/IngredientModal.js

import React, { useState } from 'react';
import Button from '../../components/atoms/Button';
import Modal from '../../components/molecules/Modal';
import ImageUploadPreview from '../../components/molecules/ImageUploadPreview';

const IngredientModal = ({ onConfirm, onCancel, selectedFile, fileChangeHandler }) => {
  const [localFile, setLocalFile] = useState(selectedFile);

  const handleFileChange = (file) => {
    setLocalFile(file);
    fileChangeHandler(file);
  };

  return (
    <Modal title="영수증을 올려주세요" onClose={onCancel}>
      <ImageUploadPreview onFileSelect={handleFileChange} />
      <div className="d-flex justify-content-around mt-3">
        <Button variant="success" onClick={() => onConfirm(localFile)}>확인</Button>
        <Button variant="danger" onClick={onCancel}>취소</Button>
      </div>
    </Modal>
  );
};

export default IngredientModal;
