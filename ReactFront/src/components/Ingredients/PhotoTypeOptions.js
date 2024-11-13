// src/components/Ingredients/PhotoTypeOptions.js

import React from 'react';
import './PhotoTypeOptions.css';

const PhotoTypeOptions = ({ selectedType, onTypeChange }) => (
  <div className="photo-type-options">
    {['영수증 인식', '구매내역 캡쳐', '물체 인식'].map((type) => (
      <label key={type}>
        <input
          type="radio"
          name="photoType"
          value={type}
          checked={selectedType === type}
          onChange={onTypeChange}
        />
        {type}
      </label>
    ))}
  </div>
);

export default PhotoTypeOptions;
