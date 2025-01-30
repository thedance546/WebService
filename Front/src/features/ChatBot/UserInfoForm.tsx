// src/features/ChatBot/UserInfoForm.tsx

import React from 'react';
import Input from '../../components/atoms/Input';
import { UserInfoFormProps } from '../../types/FeatureTypes';
import UserInputLists from '../../constants/CustomUserInputList';
import CheckBoxGroupCard from '../../components/molecules/CheckBoxGroupCard';
import RadioBoxCard from '../../components/molecules/RadioBoxCard';
import Grid from '../../components/atoms/Grid';

const UserInfoForm: React.FC<UserInfoFormProps> = ({ formData, setFormData }) => {
    const handleRadioChange = (field: string, value: string): void => {
        setFormData((prev: any) => ({
          ...prev,
          [field]: value,
        }));
      };
      
      const handleCheckboxChange = (field: string, value: string): void => {
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
      <Grid columns={1} columnsMd={2} className="gap-4">
        <RadioBoxCard
          title="연령대"
          name="ageGroup"
          options={UserInputLists.AGE_GROUPS.map((age) => ({ label: age, value: age }))}
          selectedValue={formData.ageGroup}
          onChange={(value) => handleRadioChange('ageGroup', value)}
          columns={4}
        />
        <RadioBoxCard
          title="성별"
          name="gender"
          options={UserInputLists.GENDERS.map((gender) => ({ label: gender, value: gender }))}
          selectedValue={formData.gender}
          onChange={(value) => handleRadioChange('gender', value)}
          columns={3}
        />
        <RadioBoxCard
          title="건강 목표"
          name="healthGoal"
          options={UserInputLists.HEALTH_GOALS.map((goal) => ({ label: goal, value: goal }))}
          selectedValue={formData.healthGoal}
          onChange={(value) => handleRadioChange('healthGoal', value)}
          columns={3}
        />
        <CheckBoxGroupCard
          title="식사 시간대"
          options={UserInputLists.MEAL_TIMES.map((meal) => ({ label: meal, value: meal }))}
          selectedValues={formData.mealTimes}
          onChange={(value) => handleCheckboxChange('mealTimes', value)}
          columns={4}
        />
        <CheckBoxGroupCard
          title="음식 카테고리"
          options={UserInputLists.FOOD_CATEGORIES.map((category) => ({ label: category, value: category }))}
          selectedValues={formData.foodCategories}
          onChange={(value) => handleCheckboxChange('foodCategories', value)}
          columns={3}
        />
        <div className="card mb-3">
          <div className="card-header">음식 카테고리 직접 입력</div>
          <div className="card-body">
            <Input
              value={formData.customFoodCategory || ''}
              onChange={(e) => setFormData({ ...formData, customFoodCategory: e.target.value })}
              placeholder="직접 입력"
              className="form-control"
            />
          </div>
        </div>
        <CheckBoxGroupCard
          title="알레르기 및 기피재료"
          options={UserInputLists.ALLERGIES.map((allergy) => ({ label: allergy, value: allergy }))}
          selectedValues={formData.allergies}
          onChange={(value) => handleCheckboxChange('allergies', value)}
          columns={3}
        />
        <div className="card mb-3">
          <div className="card-header">알레르기 및 기피재료 직접 입력</div>
          <div className="card-body">
            <Input
              value={formData.customAllergy || ''}
              onChange={(e) => setFormData({ ...formData, customAllergy: e.target.value })}
              placeholder="직접 입력"
              className="form-control"
            />
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default UserInfoForm;
