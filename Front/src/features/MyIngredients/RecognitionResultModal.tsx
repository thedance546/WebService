// src/features/ChatBot/RecipeRecommendationModal.tsx

import React, { useState } from 'react';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';
import { Ingredient } from '../../types/EntityTypes';

interface RecognitionResultModalProps {
  resultList: Ingredient[];
  onConfirm: (editedIngredients: Ingredient[]) => void;
  onClose: () => void;
}

const RecognitionResultModal: React.FC<RecognitionResultModalProps> = ({
  resultList,
  onConfirm,
  onClose,
}) => {
  const [editedResult, setEditedResult] = useState<Ingredient[]>(resultList);
  const [purchaseDate, setPurchaseDate] = useState<string>('');

  const handleEdit = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = [...editedResult];
    updated[index] = { ...updated[index], [field]: value };
    setEditedResult(updated);
  };

  const handleAddRow = () => {
    setEditedResult([...editedResult, { ingredientId: Date.now(), name: '', quantity: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    const updated = editedResult.filter((_, i) => i !== index);
    setEditedResult(updated);
  };

  const handleConfirm = () => {
    if (!purchaseDate) {
      alert('구매일자를 입력해주세요.');
      return;
    }

    const validItems = editedResult.filter((item) => item.name.trim() !== '');
    if (validItems.length === 0) {
      alert('추가할 유효한 항목이 없습니다.');
      return;
    }

    const resultWithDate = validItems.map((item) => ({
      ...item,
      purchaseDate,
    }));

    onConfirm(resultWithDate);
  };

  return (
    <FullScreenOverlay
      title="인식 결과"
      onClose={onClose}
    >
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
            <tr key={item.ingredientId}>
              <td>
                <Input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleEdit(index, 'name', e.target.value)}
                  className="form-control"
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleEdit(index, 'quantity', Number(e.target.value))}
                  className="form-control"
                />
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveRow(index)}
                  className="btn-sm"
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 버튼 그룹 */}
      <div className="d-flex justify-content-between mt-3">
        <Button variant="primary" onClick={handleAddRow}>
          항목 추가
        </Button>
        <div>
          <Button
            variant="success"
            onClick={handleConfirm}
            disabled={!purchaseDate || editedResult.length === 0}
            className="me-2"
          >
            확인
          </Button>
          <Button variant="danger" onClick={onClose}>
            취소
          </Button>
        </div>
      </div>
    </FullScreenOverlay>
  );
};

export default RecognitionResultModal;
