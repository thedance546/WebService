// src/components/Ingredients/RecognitionResultModal.js
import React from 'react';

const RecognitionResultModal = ({ result, onClose }) => (
  <div className="modal show d-block">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content p-4">
        <h3>인식 결과</h3>
        <div className="text-center mb-3">
          <img src={result.resultImage} alt="결과 이미지" className="img-fluid rounded" />
        </div>
        <ul className="list-unstyled">
          {result.resultList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <div className="d-flex justify-content-around mt-3">
          <button className="btn btn-success" onClick={onClose}>확인</button>
          <button className="btn btn-danger" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  </div>
);

export default RecognitionResultModal;
