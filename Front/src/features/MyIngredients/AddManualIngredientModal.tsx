// src/features/MyIngredients/AddManualIngredientModal.tsx

import React, { useState } from 'react';
import Button from '../../components/atoms/Button';
import FullScreenOverlay from '../../components/molecules/FullScreenOverlay';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createManualOrder } from '../../services/ServiceApi';
import { useIngredients } from '../../contexts/IngredientsContext';

interface AddManualIngredientModalProps {
    onClose: () => void;
}

const AddManualIngredientModal: React.FC<AddManualIngredientModalProps> = ({
    onClose,
}) => {
    const { refreshIngredients } = useIngredients();
    const [orderDate, setOrderDate] = useState<Date | null>(null);
    const [orderItems, setOrderItems] = useState([
        {
            itemName: '',
            count: 1,
            category: '',
            storageMethod: '',
            sellByDate: null as Date | null,
            useByDate: null as Date | null,
        },
    ]);

    const handleAddRow = () => {
        setOrderItems([
            ...orderItems,
            {
                itemName: '',
                count: 1,
                category: '',
                storageMethod: '',
                sellByDate: null,
                useByDate: null,
            },
        ]);
    };

    const handleRemoveRow = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const handleInputChange = (index: number, field: string, value: string | number | Date | null) => {
        const updatedItems = [...orderItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setOrderItems(updatedItems);
    };

    const formatDate = (date: Date): string => {
        const year = date.getUTCFullYear(); // UTC 기준 연도
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // UTC 기준 월
        const day = String(date.getUTCDate()).padStart(2, '0'); // UTC 기준 일
        return `${year}-${month}-${day}`;
    };
    
    const handleSubmit = async () => {
        if (!orderDate) {
            alert("구매일자를 입력해주세요.");
            return;
        }

        const invalidDates = orderItems.some((item) => {
            if (item.sellByDate && item.sellByDate < orderDate) {
                alert(`유통기한은 구매일자(${formatDate(orderDate)})보다 빠를 수 없습니다.`);
                return true;
            }
            if (item.useByDate && item.useByDate < orderDate) {
                alert(`소비기한은 구매일자(${formatDate(orderDate)})보다 빠를 수 없습니다.`);
                return true;
            }
            return false;
        });

        if (invalidDates) {
            return;
        }

        const missingFields = orderItems.some(
            (item) =>
                !item.itemName ||
                !item.count ||
                !item.category ||
                !item.storageMethod ||
                !item.sellByDate ||
                !item.useByDate
        );

        if (missingFields) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        // JSON 데이터 준비
        const orderData = {
            orderDate: formatDate(orderDate),
            orderItems: orderItems.map((item) => ({
                itemName: item.itemName,
                count: item.count,
                category: item.category,
                storageMethod: item.storageMethod,
                sellByDays: calculateDaysFromPurchase(item.sellByDate, orderDate), // 구매일자 기준으로 계산
                useByDays: calculateDaysFromPurchase(item.useByDate, orderDate),  // 구매일자 기준으로 계산
            })),
        };

        console.log(orderData);
        try {
            await createManualOrder(orderData);
            await refreshIngredients();
            onClose();
        } catch (error) {
            console.error("등록 실패:", error);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    const calculateDaysFromPurchase = (targetDate: Date | null, purchaseDate: Date | null): number => {
        if (!targetDate || !purchaseDate) return 0;

        // 기준 날짜와 목표 날짜를 UTC로 변환해 시간 차이를 계산
        const utcPurchase = Date.UTC(
            purchaseDate.getUTCFullYear(),
            purchaseDate.getUTCMonth(),
            purchaseDate.getUTCDate()
        );
        const utcTarget = Date.UTC(
            targetDate.getUTCFullYear(),
            targetDate.getUTCMonth(),
            targetDate.getUTCDate()
        );

        return Math.ceil((utcTarget - utcPurchase) / (1000 * 60 * 60 * 24)); // ms -> days
    };

    return (
        <FullScreenOverlay title="직접 추가" onClose={onClose}>
            {/* 구매일자 */}
            <div className="mb-4 d-flex align-items-center">
                <label htmlFor="orderDate" className="form-label me-2" style={{ width: '100px' }}>
                    구매일자:
                </label>
                <DatePicker
                    selected={orderDate}
                    onChange={(date) => setOrderDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="form-control w-auto"
                    placeholderText="연도-월-일"
                />
            </div>

            {orderItems.map((item, index) => (
                <div key={index} className="mb-4 border p-3 rounded">
                    <h5 className="mb-3">항목 {index + 1}</h5>

                    {/* 아이템 이름 */}
                    <div className="mb-2 d-flex align-items-center">
                        <label htmlFor={`itemName-${index}`} className="form-label me-2" style={{ width: '100px' }}>
                            아이템 이름:
                        </label>
                        <input
                            type="text"
                            id={`itemName-${index}`}
                            placeholder="예: 감자"
                            value={item.itemName}
                            onChange={(e) => handleInputChange(index, 'itemName', e.target.value)}
                            className="form-control w-auto"
                        />
                    </div>

                    {/* 수량 */}
                    <div className="mb-2 d-flex align-items-center">
                        <label htmlFor={`count-${index}`} className="form-label me-2" style={{ width: '100px' }}>
                            수량:
                        </label>
                        <input
                            type="number"
                            id={`count-${index}`}
                            placeholder="숫자 입력"
                            value={item.count}
                            onChange={(e) => handleInputChange(index, 'count', Number(e.target.value))}
                            className="form-control w-auto"
                        />
                    </div>

                    {/* 카테고리 */}
                    <div className="mb-2 d-flex align-items-center">
                        <label htmlFor={`category-${index}`} className="form-label me-2" style={{ width: '100px' }}>
                            카테고리:
                        </label>
                        <input
                            type="text"
                            id={`category-${index}`}
                            placeholder="예: 채소, 육류 등"
                            value={item.category}
                            onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                            className="form-control w-auto"
                        />
                    </div>

                    {/* 보관방법 */}
                    <div className="mb-2 d-flex align-items-center">
                        <label htmlFor={`storageMethod-${index}`} className="form-label me-2" style={{ width: '100px' }}>
                            보관방법:
                        </label>
                        <input
                            type="text"
                            id={`storageMethod-${index}`}
                            placeholder="예: 냉장, 냉동, 상온"
                            value={item.storageMethod}
                            onChange={(e) => handleInputChange(index, 'storageMethod', e.target.value)}
                            className="form-control w-auto"
                        />
                    </div>

                    {/* 유통기한 */}
                    <div className="mb-2 d-flex align-items-center">
                        <label className="form-label me-2" style={{ width: '100px' }}>
                            유통기한:
                        </label>
                        <DatePicker
                            selected={item.sellByDate}
                            onChange={(date) => handleInputChange(index, 'sellByDate', date)}
                            dateFormat="yyyy-MM-dd"
                            className="form-control w-auto"
                            placeholderText="유통기한 입력"
                        />
                    </div>

                    {/* 소비기한 */}
                    <div className="mb-2 d-flex align-items-center">
                        <label className="form-label me-2" style={{ width: '100px' }}>
                            소비기한:
                        </label>
                        <DatePicker
                            selected={item.useByDate}
                            onChange={(date) => handleInputChange(index, 'useByDate', date)}
                            dateFormat="yyyy-MM-dd"
                            className="form-control w-auto"
                            placeholderText="소비기한 입력"
                        />
                    </div>

                    <Button variant="danger" onClick={() => handleRemoveRow(index)}>
                        항목 삭제
                    </Button>
                </div>
            ))}

            <Button variant="primary" onClick={handleAddRow}>항목 추가</Button>
            <div className="d-flex justify-content-end mt-3 gap-2">
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
