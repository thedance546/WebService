// src/features/Ingredients/PhotoTypeOptions.js
import React from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

const PhotoTypeOptions = ({ selectedType, onTypeChange }) => (
  <div className="my-3 text-start">
    <p className="fw-bold mb-2">이미지 타입 선택</p>
    <ToggleButtonGroup
      type="radio"
      name="photoType"
      value={selectedType} // 선택된 타입을 표시
      onChange={(val) => onTypeChange({ target: { value: val } })} // 값 변경 시 상위에 전달
      className="w-100"
    >
      <ToggleButton
        id="radio-1"
        variant={selectedType === '영수증' ? 'primary' : 'outline-primary'}
        value="영수증"
        className="w-50"
      >
        영수증
      </ToggleButton>
      <ToggleButton
        id="radio-2"
        variant={selectedType === '온라인 구매내역 캡쳐' ? 'primary' : 'outline-primary'}
        value="온라인 구매내역 캡쳐"
        className="w-50"
      >
        온라인 구매내역 캡쳐
      </ToggleButton>
    </ToggleButtonGroup>
  </div>
);

export default PhotoTypeOptions;
