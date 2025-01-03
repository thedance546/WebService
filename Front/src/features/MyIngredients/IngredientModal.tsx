// src/features/MyIngredients/IngredientModal.tsx

import React, { useState } from 'react';
import Button from '../../components/atoms/Button';
import Modal from '../../components/molecules/Modal';
import ImageUploadPreview from '../../components/molecules/ImageUploadPreview';

interface IngredientModalProps {
  onConfirm: (file: File | null) => void;
  onCancel: () => void;
  selectedFile: File | null;
  fileChangeHandler: (file: File) => void;
}

const IngredientModal: React.FC<IngredientModalProps> = ({
  onConfirm,
  onCancel,
  selectedFile,
  fileChangeHandler,
}) => {
  const [localFile, setLocalFile] = useState<File | null>(selectedFile);

  const handleFileChange = (file: File) => {
    setLocalFile(file);
    fileChangeHandler(file);
  };

  return (
    <Modal title="식재료 등록하기" onClose={onCancel}>
      <ImageUploadPreview
        onFileSelect={handleFileChange}
        previewStyle={{ minHeight: '300px', maxHeight: '300px', maxWidth: '100%' }}
        placeholderMessage="영수증을 올려주세요!"
      />
      <div className="d-flex justify-content-around mt-3">
        <Button variant="success" onClick={() => onConfirm(localFile)}>확인</Button>
        <Button variant="danger" onClick={onCancel}>취소</Button>
      </div>
    </Modal>
  );
};

export default IngredientModal;
