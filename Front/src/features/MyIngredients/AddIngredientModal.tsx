// src/features/MyIngredients/AddIngredientModal.tsx

import React, { useState, useEffect } from 'react';
import Button from '../../components/atoms/Button';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import EditIngredientForm from '../../components/organisms/EditIngredientForm';
import LoadingModal from '../../components/organisms/LoadingModal';
import { Ingredient } from '../../types/EntityTypes';
import { createReceiptsOrder } from '../../services/ServiceApi';
import { useIngredients } from '../../contexts/IngredientsContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

  const parseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    parseDate(initialPurchaseDate)
  );

  useEffect(() => {
    const initialIngredients = matchedItems.map((item, index) => ({
      ingredientId: Date.now() + index,
      name: item,
      quantity: 1,
    }));
    setIngredients(initialIngredients);
  }, [matchedItems]);

  const handleConfirm = async () => {
    if (!selectedDate) {
      alert('구매일자를 선택해주세요.');
      return;
    }

    const validItems = ingredients.filter((item) => item.name.trim() !== '');
    if (validItems.length === 0) {
      alert('추가할 유효한 항목이 없습니다.');
      return;
    }

    const orderData = {
      orderDate: selectedDate.toISOString().split('T')[0],
      orderItems: validItems.map((item) => ({
        itemName: item.name,
        count: item.quantity,
      })),
    };

    console.log(orderData);
    setIsLoading(true);

    try {
      // 서버에 주문 데이터 전송
      await createReceiptsOrder(orderData);

      // 컨텍스트 데이터 새로고침
      await refreshIngredients();

      alert('식재료 등록이 완료되었습니다.');
      onClose();
    } catch (error) {
      console.error('식재료 등록 실패:', error);
      alert('등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingModal />}
      <FullScreenOverlay title="인식된 식재료" onClose={onClose}>
        <div className="mb-3">
          <label
            htmlFor="purchaseDate"
            className="form-label fw-bold"
            style={{ marginRight: '15px' }}
          >
            구매일자
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            placeholderText="날짜를 선택하세요"
          />
        </div>

        <EditIngredientForm
          ingredients={ingredients}
          onIngredientsChange={setIngredients}
        />

        <div className="d-flex justify-content-end mt-3 gap-2">
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
