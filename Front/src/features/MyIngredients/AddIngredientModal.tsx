// src/features/MyIngredients/AddIngredientModal.tsx

import React, { useState, useEffect } from 'react';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import Button from '../../components/atoms/Button';
import EditIngredientForm from '../../components/organisms/EditIngredientForm';
import Input from '../../components/atoms/Input';
import { Ingredient } from '../../types/EntityTypes';
import useDateInput from '../../hooks/useDateInput';

interface AddIngredientModalProps {
  matchedItems: string[];
  purchaseDate: string;
  onConfirm: (editedIngredients: Ingredient[]) => void;
  onClose: () => void;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  matchedItems,
  purchaseDate: initialPurchaseDate,
  onConfirm,
  onClose,
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const purchaseDateInput = useDateInput(initialPurchaseDate);

  useEffect(() => {
    const initialIngredients = matchedItems.map((item) => ({
      ingredientId: Date.now() + Math.random(),
      name: item,
      quantity: 1,
    }));
    setIngredients(initialIngredients);
  }, [matchedItems]);

  const handleConfirm = () => {
    const parsedPurchaseDate = purchaseDateInput.getParsedValue();

    if (!parsedPurchaseDate) {
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
      purchaseDate: parsedPurchaseDate,
    }));

    onConfirm(resultWithDate);
  };

  return (
    <FullScreenOverlay title="인식된 식재료" onClose={onClose}>
      <div className="mb-3">
        <label htmlFor="purchaseDate" className="form-label fw-bold">구매일자</label>
        <Input
          type="text"
          id="purchaseDate"
          value={purchaseDateInput.value}
          onChange={purchaseDateInput.onChange}
          onBlur={purchaseDateInput.onBlur}
          className="form-control"
        />
      </div>

      <EditIngredientForm
        ingredients={ingredients}
        onIngredientsChange={setIngredients}
      />

      <div className="d-flex justify-content-end mt-3">
        <Button variant="success" onClick={handleConfirm}>
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
