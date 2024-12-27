// src/features/ChatBot/CustomInfoInputModal.tsx

import React, { useState } from 'react';
import Modal from '../../components/molecules/FullScreenOverlay';
import Button from '../../components/atoms/Button';

interface CustomInfoInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (info: Record<string, any>) => void;
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
  });

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev) => {
      const selected = prev[field as keyof typeof formData] as string[];
      return {
        ...prev,
        [field]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      ageGroup: '',
      gender: '',
      activityLevel: '',
      healthGoal: '',
      allergies: [],
      mealTimes: [],
      foodCategories: [],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal title="사용자 정보 입력" onClose={onClose}>
      <div className="p-3">
        {/* Age Group */}
        <h6>나이</h6>
        <div>
          {['10대', '20대', '30대', '40대 이상'].map((age) => (
            <label key={age} className="me-3">
              <input
                type="radio"
                name="ageGroup"
                value={age}
                checked={formData.ageGroup === age}
                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
              />
              {age}
            </label>
          ))}
        </div>

        {/* Gender */}
        <h6>성별</h6>
        <div>
          {['남성', '여성'].map((gender) => (
            <label key={gender} className="me-3">
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={formData.gender === gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              />
              {gender}
            </label>
          ))}
        </div>

        {/* Other Fields */}
        {/* Similar blocks for activity level, health goals, allergies, meal times, and food categories */}

        <div className="d-flex justify-content-end mt-3">
          <Button onClick={onClose} variant="secondary" className="me-2">
            취소
          </Button>
          <Button onClick={handleSubmit} variant="primary">
            제출
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomInfoInputModal;