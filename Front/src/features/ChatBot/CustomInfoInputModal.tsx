// src/features/ChatBot/CustomInfoInputModal.tsx

import React, { useState, useEffect } from 'react';
import Modal from '../../components/molecules/FullScreenOverlay';
import Button from '../../components/atoms/Button';
import UserInfoForm from './UserInfoForm';

interface CustomInfoInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (info: string) => void;
}

const LOCAL_STORAGE_KEY = 'userFormData';

const CustomInfoInputModal: React.FC<CustomInfoInputModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    ageGroup: '',
    gender: '',
    activityLevel: '',
    healthGoal: '',
    allergies: [] as string[],
    mealTimes: [] as string[],
    foodCategories: [] as string[],
    customAllergy: '',
    customFoodCategory: '',
  });

  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
    }
  }, [isOpen]);

  const handleSubmit = () => {
    // if (!formData.ageGroup || !formData.gender || !formData.activityLevel || !formData.healthGoal) {
    //   toast.error('모든 필드를 입력해주세요.', {
    //     position: 'top-center',
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    //   return;
    // }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
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
          <Button onClick={handleSubmit} variant="primary">제출</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomInfoInputModal;
