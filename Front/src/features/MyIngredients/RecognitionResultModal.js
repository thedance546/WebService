// src/features/MyIngredients/RecognitionResultModal.js
import React, { useState } from 'react';
import Input from '../../components/atoms/Input';

const RecognitionResultModal = ({ result, onConfirm, onClose }) => {
  const [editedResult, setEditedResult] = useState(result.resultList);
  const [purchaseDate, setPurchaseDate] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...editedResult];
    updated[index][field] = value;
    setEditedResult(updated);
  };

  const handleAddRow = () => {
    setEditedResult([...editedResult, { name: '', quantity: '' }]);
  };

  const handleRemoveRow = (index) => {
    const updated = editedResult.filter((_, i) => i !== index);
    setEditedResult(updated);
  };

  const handleConfirm = () => {
    if (!purchaseDate) {
      alert("구매일자를 입력해주세요.");
      return;
    }

    const validItems = editedResult.filter((item) => item.name.trim() !== "");
    if (validItems.length === 0) {
      alert("추가할 유효한 항목이 없습니다.");
      return;
    }

    const resultWithDate = validItems.map((item) => ({
      ...item,
      purchaseDate,
    }));

    onConfirm(resultWithDate);
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h3>인식 결과</h3>

          {/* 구매일자 입력 */}
          <div className="mb-3">
            <label htmlFor="purchaseDate" className="form-label fw-bold">구매일자</label>
            <Input
              type="date"
              id="purchaseDate"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="form-control"
            />
          </div>

          {/* 상품명 및 수량 입력 */}
          <table className="table">
            <thead>
              <tr>
                <th>상품명</th>
                <th>수량</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {editedResult.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveRow(index)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 버튼 그룹 */}
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-primary" onClick={handleAddRow}>
              항목 추가
            </button>
            <div>
              <button className="btn btn-success me-2" onClick={handleConfirm}>
                확인
              </button>
              <button className="btn btn-danger" onClick={onClose}>
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecognitionResultModal;