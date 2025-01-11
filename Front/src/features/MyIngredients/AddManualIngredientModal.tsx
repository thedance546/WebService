// src/features/MyIngredients/AddManualIngredientModal.tsx

import React, { useState } from 'react';
import Button from '../../components/atoms/Button';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import { createManualOrder } from '../../services/ServiceApi';

interface AddManualIngredientModalProps {
  onClose: () => void;
}

const AddManualIngredientModal: React.FC<AddManualIngredientModalProps> = ({ onClose }) => {
  const [orderDate, setOrderDate] = useState<string>('');
  const [orderItems, setOrderItems] = useState([
    { itemName: '', count: 1, category: '', storageMethod: '', sellByDays: 0, useByDays: 0 },
  ]);

  const handleAddRow = () => {
    setOrderItems([
      ...orderItems,
      { itemName: '', count: 1, category: '', storageMethod: '', sellByDays: 0, useByDays: 0 },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setOrderItems(updatedItems);
  };

  const handleSubmit = async () => {
    if (!orderDate) {
      alert('구매일자를 입력해주세요.');
      return;
    }

    try {
      await createManualOrder({ orderDate, orderItems });
      alert('직접 추가가 완료되었습니다.');
      onClose();
    } catch (error) {
      console.error('직접 추가 실패:', error);
      alert('추가에 실패했습니다.');
    }
  };

  return (
    <FullScreenOverlay title="직접 추가" onClose={onClose}>
      <div className="mb-3">
        <label htmlFor="orderDate" className="form-label">구매일자</label>
        <input
          type="date"
          id="orderDate"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          className="form-control"
        />
      </div>
      {orderItems.map((item, index) => (
        <div key={index} className="mb-3">
          <input
            type="text"
            placeholder="재료명"
            value={item.itemName}
            onChange={(e) => handleInputChange(index, 'itemName', e.target.value)}
            className="form-control mb-2"
          />
          <input
            type="number"
            placeholder="수량"
            value={item.count}
            onChange={(e) => handleInputChange(index, 'count', Number(e.target.value))}
            className="form-control mb-2"
          />
          <Button variant="danger" onClick={() => handleRemoveRow(index)}>
            삭제
          </Button>
        </div>
      ))}
      <Button variant="primary" onClick={handleAddRow}>항목 추가</Button>
      <div className="d-flex justify-content-end mt-3">
        <Button variant="success" onClick={handleSubmit}>
          등록
        </Button>
        <Button variant="danger" onClick={onClose}>
          취소
        </Button>
      </div>
    </FullScreenOverlay>
  );
};

export default AddManualIngredientModal;
