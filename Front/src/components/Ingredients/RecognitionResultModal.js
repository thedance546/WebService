// src/components/Ingredients/RecognitionResultModal.js
import React, { useState } from 'react';

const RecognitionResultModal = ({ result, onConfirm, onClose }) => {
  const [editedResult, setEditedResult] = useState(result.resultList);

  const handleChange = (index, field, value) => {
    const updated = [...editedResult];
    updated[index][field] = value;
    setEditedResult(updated);
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h3>인식 결과</h3>
          <div className="mb-3">
            <img src={result.resultImage} alt="결과 이미지" className="img-fluid rounded" />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>이름</th>
                <th>수량</th>
              </tr>
            </thead>
            <tbody>
              {editedResult.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={item.quantity}
                      onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-around mt-3">
            <button className="btn btn-success" onClick={() => onConfirm(editedResult)}>
              확인
            </button>
            <button className="btn btn-danger" onClick={onClose}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecognitionResultModal;
