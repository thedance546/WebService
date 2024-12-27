// src/features/ChatBot/PromptGenerator.tsx

import React, { useState } from 'react';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';

interface PromptGeneratorProps {
  formData: any;
}

const PromptGenerator: React.FC<PromptGeneratorProps> = ({ formData }) => {
  const [prompt, setPrompt] = useState('');

  const generatePrompt = () => {
    const newPrompt = `나이: ${formData.ageGroup},
    성별: ${formData.gender},
    건강 목표: ${formData.healthGoal},
    알레르기: ${formData.allergies.join(', ')}${formData.customAllergy ? `, ${formData.customAllergy}` : ''},
    식사 시간대: ${formData.mealTimes.join(', ')},
    음식 카테고리: ${formData.foodCategories.join(', ')}${formData.customFoodCategory ? `, ${formData.customFoodCategory}` : ''}`;
    setPrompt(newPrompt);
  };

  return (
    <div className="card mt-4">
      <div className="card-header">프롬프트</div>
      <div className="card-body">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="입력한 내용이 여기에 표시됩니다."
          className="form-control mb-3"
          style={{ resize: 'vertical' }}
        />
        <Button onClick={generatePrompt} className="btn btn-secondary">
          프롬프트 생성
        </Button>
      </div>
    </div>
  );
};

export default PromptGenerator;
