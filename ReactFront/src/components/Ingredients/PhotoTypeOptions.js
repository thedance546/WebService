// src/components/Ingredients/PhotoTypeOptions.js
import React from 'react';

const PhotoTypeOptions = ({ selectedType, onTypeChange }) => (
  <div className="my-3">
    {['영수증 인식', '구매내역 캡쳐', '물체 인식'].map((type) => (
      <div className="form-check" key={type}>
        <input
          className="form-check-input"
          type="radio"
          name="photoType"
          value={type}
          checked={selectedType === type}
          onChange={onTypeChange}
        />
        <label className="form-check-label">{type}</label>
      </div>
    ))}
  </div>
);

export default PhotoTypeOptions;
