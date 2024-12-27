// src/features/ChatBot/UserInfoForm.tsx

import React, { useState } from 'react';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';

interface UserInfoFormProps {
  formData: {
    ageGroup: string;
    gender: string;
    activityLevel: string;
    healthGoal: string;
    allergies: string[];
    mealTimes: string[];
    foodCategories: string[];
    customAllergy: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ formData, setFormData }) => {
  const [prompt, setPrompt] = useState('');

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev: any) => {
      const selected = prev[field] as string[];
      return {
        ...prev,
        [field]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
  };

  const generatePrompt = () => {
    const newPrompt = `나이: ${formData.ageGroup}, 성별: ${formData.gender}, 활동 수준: ${formData.activityLevel}, 건강 목표: ${formData.healthGoal}, 알레르기: ${formData.allergies.join(', ')}, 식사 시간대: ${formData.mealTimes.join(', ')}, 음식 카테고리: ${formData.foodCategories.join(', ')}`;
    setPrompt(newPrompt);
  };

  return (
    <div>
      {/* Age Group */}
      <h6>나이</h6>
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

      {/* Gender */}
      <h6>성별</h6>
      {['무응답', '남성', '여성'].map((gender) => (
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

      {/* Activity Level */}
      <h6>활동 수준</h6>
      {['비활동적', '가벼운 활동', '보통 활동', '높은 활동', '매우 높은 활동'].map((level) => (
        <label key={level} className="me-3">
          <input
            type="radio"
            name="activityLevel"
            value={level}
            checked={formData.activityLevel === level}
            onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
          />
          {level}
        </label>
      ))}

      {/* Health Goal */}
      <h6>건강 목표</h6>
      {['체중 감량', '유지', '체중 증가'].map((goal) => (
        <label key={goal} className="me-3">
          <input
            type="radio"
            name="healthGoal"
            value={goal}
            checked={formData.healthGoal === goal}
            onChange={(e) => setFormData({ ...formData, healthGoal: e.target.value })}
          />
          {goal}
        </label>
      ))}

      {/* Allergies */}
      <h6>알레르기 정보</h6>
      {['땅콩', '유제품', '글루텐', '갑각류', '견과류', '달걀', '콩', '생선', '참깨'].map((allergy) => (
        <label key={allergy} className="me-3">
          <input
            type="checkbox"
            value={allergy}
            checked={formData.allergies.includes(allergy)}
            onChange={() => handleCheckboxChange('allergies', allergy)}
          />
          {allergy}
        </label>
      ))}
      <div className="mt-2">
        <label>
          직접 입력:
          <Input
            value={formData.customAllergy}
            onChange={(e) => setFormData({ ...formData, customAllergy: e.target.value })}
            placeholder="알레르기 추가"
            className="ms-2"
          />
        </label>
      </div>

      {/* Meal Times */}
      <h6>식사 시간대</h6>
      {['아침 (06:00-09:00)', '점심 (11:30-13:30)', '저녁 (18:00-20:00)', '간식 (10:00-11:00, 15:00-16:00)'].map((meal) => (
        <label key={meal} className="me-3">
          <input
            type="checkbox"
            value={meal}
            checked={formData.mealTimes.includes(meal)}
            onChange={() => handleCheckboxChange('mealTimes', meal)}
          />
          {meal}
        </label>
      ))}

      {/* Food Categories */}
      <h6>음식 카테고리</h6>
      {['메인 요리', '반찬', '디저트', '음료', '샐러드', '스낵', '수프', '스무디'].map((category) => (
        <label key={category} className="me-3">
          <input
            type="checkbox"
            value={category}
            checked={formData.foodCategories.includes(category)}
            onChange={() => handleCheckboxChange('foodCategories', category)}
          />
          {category}
        </label>
      ))}

      {/* Prompt Input and Button */}
      <h6>프롬프트</h6>
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="입력한 내용이 여기에 표시됩니다."
        className="w-100 mb-3"
        style={{ minHeight: '60px', resize: 'vertical' }}
      />
      <Button onClick={generatePrompt} variant="secondary">
        프롬프트 생성
      </Button>
    </div>
  );
};

export default UserInfoForm;
