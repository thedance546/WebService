// src/features/ChatBot/UserInfoForm.tsx

import React from 'react';
import Input from '../../components/atoms/Input';
import Grid from '../../components/atoms/Grid';
import PromptGenerator from './PromptGenerator';
import { UserInfoFormProps } from '../../types/FeatureTypes';
import UserInputLists from '../../constants/customUserInputLists';

const UserInfoForm: React.FC<UserInfoFormProps> = ({ formData, setFormData }) => {
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

  return (
    <div className="container my-4">
      {/* Age Group */}
      <div className="card mb-3">
        <div className="card-header">나이</div>
        <div className="card-body">
          <Grid columns={4}>
            {UserInputLists.AGE_GROUPS.map((age) => (
              <label key={age} className="form-check-label">
                <input
                  type="radio"
                  name="ageGroup"
                  value={age}
                  checked={formData.ageGroup === age}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                  className="form-check-input me-2"
                />
                {age}
              </label>
            ))}
          </Grid>
        </div>
      </div>

      {/* Gender */}
      <div className="card mb-3">
        <div className="card-header">성별</div>
        <div className="card-body">
          <Grid columns={3}>
            {UserInputLists.GENDERS.map((gender) => (
              <label key={gender} className="form-check-label">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="form-check-input me-2"
                />
                {gender}
              </label>
            ))}
          </Grid>
        </div>
      </div>

      {/* Health Goal */}
      <div className="card mb-3">
        <div className="card-header">건강 목표</div>
        <div className="card-body">
          <Grid columns={3}>
            {UserInputLists.HEALTH_GOALS.map((goal) => (
              <label key={goal} className="form-check-label">
                <input
                  type="radio"
                  name="healthGoal"
                  value={goal}
                  checked={formData.healthGoal === goal}
                  onChange={(e) => setFormData({ ...formData, healthGoal: e.target.value })}
                  className="form-check-input me-2"
                />
                {goal}
              </label>
            ))}
          </Grid>
        </div>
      </div>

      {/* Meal Times */}
      <div className="card mb-3">
        <div className="card-header">식사 시간대</div>
        <div className="card-body">
          <Grid columns={4}>
            {UserInputLists.MEAL_TIMES.map((meal) => (
              <label key={meal} className="form-check-label">
                <input
                  type="checkbox"
                  value={meal}
                  checked={formData.mealTimes.includes(meal)}
                  onChange={() => handleCheckboxChange('mealTimes', meal)}
                  className="form-check-input me-2"
                />
                {meal}
              </label>
            ))}
          </Grid>
        </div>
      </div>

      {/* Food Categories */}
      <div className="card mb-3">
        <div className="card-header">음식 카테고리</div>
        <div className="card-body">
          <Grid columns={3}>
            {UserInputLists.FOOD_CATEGORIES.map((category) => (
              <label key={category} className="form-check-label">
                <input
                  type="checkbox"
                  value={category}
                  checked={formData.foodCategories.includes(category)}
                  onChange={() => handleCheckboxChange('foodCategories', category)}
                  className="form-check-input me-2"
                />
                {category}
              </label>
            ))}
          </Grid>
          <div className="mt-3">
            <Input
              value={formData.customFoodCategory || ''}
              onChange={(e) =>
                setFormData({ ...formData, customFoodCategory: e.target.value })
              }
              placeholder="직접 입력"
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="card mb-3">
        <div className="card-header">알레르기 정보</div>
        <div className="card-body">
          <Grid columns={3}>
            {UserInputLists.ALLERGIES.map((allergy) => (
              <label key={allergy} className="form-check-label">
                <input
                  type="checkbox"
                  value={allergy}
                  checked={formData.allergies.includes(allergy)}
                  onChange={() => handleCheckboxChange('allergies', allergy)}
                  className="form-check-input me-2"
                />
                {allergy}
              </label>
            ))}
          </Grid>
          <div className="mt-3">
            <Input
              value={formData.customAllergy || ''}
              onChange={(e) =>
                setFormData({ ...formData, customAllergy: e.target.value })
              }
              placeholder="직접 입력"
              className="form-control"
            />
          </div>
        </div>
      </div>
      
      {/* Prompt Section */}
      <PromptGenerator formData={formData} />
    </div>
  );
};

export default UserInfoForm;
