// src/components/Ingredients/RecognitionResultModal.js

import React from 'react';
import './RecognitionResultModal.css';

const RecognitionResultModal = ({ result, onClose }) => (
  <div className="modal">
    <div className="modal-content">
      <h3>인식 결과</h3>
      <div className="preview-container">
        <img src={result.resultImage} alt="결과 이미지" className="preview-image" />
      </div>
      <ul className="result-list">
        {result.resultList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <div className="modal-buttons">
        <button className="confirm-button" onClick={onClose}>확인</button>
        <button className="cancel-button" onClick={onClose}>취소</button>
      </div>
    </div>
  </div>
);

export default RecognitionResultModal;
