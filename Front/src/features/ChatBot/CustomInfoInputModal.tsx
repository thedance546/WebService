// src/features/ChatBot/CustomInfoInputModal.tsx

import React, { useState, useEffect } from 'react';
import Modal from '../../components/molecules/FullScreenOverlay';
import Button from '../../components/atoms/Button';
import UserInfoForm from './UserInfoForm';
import { StorageKeys } from '../../constants/StorageKey';

interface CustomInfoInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (info: string) => void;
}

const CustomInfoInputModal: React.FC<CustomInfoInputModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    ageGroup: '',
    gender: '',
    healthGoal: '',
    mealTimes: [] as string[],
    foodCategories: [] as string[],
    customFoodCategory: '',
    allergies: [] as string[],
    customAllergy: '',
  });

  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem(StorageKeys.USER_INFO);
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
    }
  }, [isOpen]);

  const handleSubmit = () => {
    localStorage.setItem(StorageKeys.USER_INFO, JSON.stringify(formData));
    onSubmit(JSON.stringify(formData, null, 2));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal title="사용자 정보 입력" onClose={onClose}>
      <div className="p-3">
        <UserInfoForm formData={formData} setFormData={setFormData} />
        <div className="d-flex justify-content-end mt-3">
          <Button onClick={onClose} variant="secondary" className="me-2">취소</Button>
          <Button onClick={handleSubmit} variant="primary">저장</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomInfoInputModal;
