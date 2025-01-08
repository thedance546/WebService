// src/features/MyIngredients/AddIngredientModal.tsx

import React, { useState, useEffect } from 'react';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import Button from '../../components/atoms/Button';
import EditIngredientForm from '../../components/organisms/EditIngredientForm';
import Input from '../../components/atoms/Input';
import { Ingredient } from '../../types/EntityTypes';
import useDateInput from '../../hooks/useDateInput';
import { createOrder } from '../../services/ServiceApi';
import LoadingModal from '../../components/organisms/LoadingModal';

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

    setIsLoading(true); // 로딩 시작

    try {
      await createOrder(orderData); // 주문 등록 API 호출
      onConfirm(validItems.map((item) => ({ ...item, purchaseDate: parsedPurchaseDate }))); // 부모 컴포넌트로 데이터 전달
      onClose(); // 모달 닫기
    } catch (error) {
      // error를 안전하게 처리
      if (error instanceof Error) {
        console.error('식재료 등록 실패:', error.message);
        alert(`${error.message}`);
      } else {
        console.error('식재료 등록 실패: 알 수 없는 오류');
        alert('식재료 등록에 실패했습니다. 알 수 없는 오류입니다.');
      }
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <>
      {isLoading && <LoadingModal />} {/* 로딩 모달 */}
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
