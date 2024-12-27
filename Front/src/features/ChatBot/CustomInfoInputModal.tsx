// src/features/ChatBot/CustomInfoInputModal.tsx

import React, { useState } from 'react';
import Modal from '../../components/molecules/FullScreenOverlay';
import Button from '../../components/atoms/Button';
import UserInfoForm from './UserInfoForm';

interface CustomInfoInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (info: string) => void;
}

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
  });

  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!formData.ageGroup || !formData.gender || !formData.activityLevel || !formData.healthGoal) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    setError('');
    onSubmit(JSON.stringify(formData, null, 2));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal title="사용자 정보 입력" onClose={onClose}>
      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}
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
