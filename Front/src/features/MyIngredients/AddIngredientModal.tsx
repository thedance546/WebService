// src/features/MyIngredients/AddIngredientModal.tsx

import React, { useState } from 'react';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';
import EditIngredientForm from '../../components/organisms/EditIngredientForm';
import { Ingredient } from '../../types/EntityTypes';

interface AddIngredientModalProps {
  resultList: Ingredient[];
  onConfirm: (editedIngredients: Ingredient[]) => void;
  onClose: () => void;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  resultList,
  onConfirm,
  onClose,
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(resultList);
  const [purchaseDate, setPurchaseDate] = useState<string>('');

  const handleConfirm = () => {
    if (!purchaseDate) {
      alert('구매일자를 입력해주세요.');
      return;
    }

    const validItems = ingredients.filter((item) => item.name.trim() !== '');
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
    <FullScreenOverlay title="인식 결과" onClose={onClose}>
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

      <EditIngredientForm
        ingredients={ingredients}
        onIngredientsChange={setIngredients}
      />

      <div className="d-flex justify-content-end mt-3">
        <Button
          variant="success"
          onClick={handleConfirm}
          disabled={!purchaseDate || ingredients.length === 0}
          className="me-2"
        >
          확인
        </Button>
        <Button variant="danger" onClick={onClose}>
          취소
        </Button>
      </div>
    </FullScreenOverlay>
  );
};

export default AddIngredientModal;
