// src/features/MyIngredients/PhotoTypeOptions.js
import React from 'react';
import ToggleButtonGroup from '../../components/molecules/ToggleButtonGroup';

const PhotoTypeOptions = ({ selectedType, onTypeChange }) => {
  const options = [
    { id: 'radio-1', value: '영수증', label: '영수증' },
    { id: 'radio-2', value: '온라인 구매내역 캡쳐', label: '온라인 구매내역 캡쳐' },
  ];

  return (
    <div className="my-3 text-start">
      <p className="fw-bold mb-2">이미지 타입 선택</p>
      <ToggleButtonGroup
        type="radio"
        name="photoType"
        value={selectedType}
        options={options}
        onChange={(val) => onTypeChange({ target: { value: val } })}
        className="w-100"
      />
    </div>
  );
};

export default PhotoTypeOptions;
