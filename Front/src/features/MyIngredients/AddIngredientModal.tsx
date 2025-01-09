// src/features/MyIngredients/AddIngredientModal.tsx

import React, { useState, useEffect } from 'react';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import EditIngredientForm from '../../components/organisms/EditIngredientForm';
import LoadingModal from '../../components/organisms/LoadingModal';
import useDateInput from '../../hooks/useDateInput';
import { Ingredient } from '../../types/EntityTypes';
import { createOrder } from '../../services/ServiceApi';
import { useIngredients } from "../../contexts/IngredientsContext";

interface AddIngredientModalProps {
  matchedItems: string[];
  purchaseDate: string;
  onClose: () => void;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  matchedItems,
  purchaseDate: initialPurchaseDate,
  onClose,
}) => {
  const { refreshIngredients } = useIngredients();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const purchaseDateInput = useDateInput(initialPurchaseDate);

  useEffect(() => {
    const initialIngredients = matchedItems.map((item) => ({
      ingredientId: Date.now() + Math.random(),
      name: item,
      quantity: 1,
    }));
    setIngredients(initialIngredients);
  }, [matchedItems]);

  const handleConfirm = async () => {
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

    const orderData = {
      orderDate: parsedPurchaseDate,
      orderItems: validItems.map((item) => ({
        itemName: item.name,
        count: item.quantity,
      })),
    };

    setIsLoading(true);

    try {
      await createOrder(orderData);
      await refreshIngredients();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error('식재료 등록 실패:', error.message);
        alert(`식재료 등록에 실패했습니다. 오류: ${error.message}`);
      } else {
        console.error('식재료 등록 실패: 알 수 없는 오류');
        alert('식재료 등록에 실패했습니다. 알 수 없는 오류입니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingModal />}
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
    </>
  );
};

export default AddIngredientModal;
