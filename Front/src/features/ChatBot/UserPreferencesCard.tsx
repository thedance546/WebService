// src/components/UserPreferencesCard.tsx

import React from 'react';

interface UserPreferencesCardProps {
  userInfo: any;
}

const UserPreferencesCard: React.FC<UserPreferencesCardProps> = ({ userInfo }) => {
  return (
    <div className="user-info-summary mt-4 p-3 border rounded bg-light">
      <h5>사용자 맞춤 정보</h5>
      <div className="card mb-3">
        <div className="card-body">
          <p><strong>연령대 및 성별:</strong> {userInfo.ageGroup} / {userInfo.gender}</p>
          <p><strong>건강 목표:</strong> {userInfo.healthGoal}</p>
          <p><strong>선호 시간대:</strong> {userInfo.mealTimes.join(', ') || '미입력'}</p>
          <p><strong>선호 음식 카테고리:</strong> 
            {userInfo.foodCategories.join(', ')} 
            {userInfo.customFoodCategory ? `, ${userInfo.customFoodCategory}` : ''}
          </p>
          <p><strong>알레르기 및 기피재료:</strong> 
            {userInfo.allergies.join(', ')} 
            {userInfo.customAllergy ? `, ${userInfo.customAllergy}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPreferencesCard;
