// src/features/MyIngredients/IngredientDetailsModal.tsx

import React, { useState } from "react";
import Modal from "../../components/molecules/Modal";
import { Ingredient } from "../../types/EntityTypes";
import { useIngredients } from "../../contexts/IngredientsContext";

export interface IngredientDetailsModalProps {
  row: Ingredient;
  onQuantityUpdated: (updatedIngredient: Ingredient) => void;
  onClose: () => void;
}

const IngredientDetailsModal: React.FC<IngredientDetailsModalProps> = ({
  row,
  onQuantityUpdated,
  onClose,
}) => {
  const [selectedQuantity, setSelectedQuantity] = useState(row.quantity);
  const [loading, setLoading] = useState(false);
  const { updateIngredientQuantity, deleteIngredient } = useIngredients();

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateIngredientQuantity(row.ingredientId, selectedQuantity);
      onQuantityUpdated({ ...row, quantity: selectedQuantity });
    } catch (error) {
      console.error("수량 업데이트 실패:", error);
      alert("수량 업데이트 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("정말로 이 식재료를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      setLoading(true);
      await deleteIngredient(row.ingredientId);
      onClose();
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="식재료 상세정보" onClose={onClose}>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              이름
            </th>
            <td style={{ width: "70%" }}>{row.name || "알 수 없음"}</td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              수량
            </th>
            <td style={{ width: "70%" }}>
              <select
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value, 10))}
                className="form-select"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              카테고리
            </th>
            <td style={{ width: "70%" }}>{row.category?.categoryName || "알 수 없음"}</td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              저장방식
            </th>
            <td style={{ width: "70%" }}>{row.storageMethod?.storageMethodName || "알 수 없음"}</td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              구매일자
            </th>
            <td style={{ width: "70%" }}>{row.purchaseDate || "알 수 없음"}</td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              유통기한
            </th>
            <td style={{ width: "70%" }}>{row.shelfLife || "알 수 없음"}</td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              소비기한
            </th>
            <td style={{ width: "70%" }}>{row.consumeBy || "알 수 없음"}</td>
          </tr>
        </tbody>
      </table>
      <div className="d-flex justify-content-between mt-3 gap-2">
        <button className="btn btn-success" onClick={handleSave} disabled={loading}>
          저장
        </button>
        <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
          삭제
        </button>
      </div>
    </Modal>
  );
};

export default IngredientDetailsModal;
