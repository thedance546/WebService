// src/features/MyIngredients/EditIngredientModal.tsx

import React, { useState } from "react";
import Modal from "../../components/molecules/Modal";
import Input from "../../components/atoms/Input";
import { Ingredient, StorageMethod } from "../../types/EntityTypes";
import useDateInput from "../../hooks/useDateInput";
import { useIngredients } from "../../contexts/IngredientsContext";

export interface EditIngredientModalProps {
  row: Ingredient;
  storageMethods: StorageMethod[];
  onSave: (updatedIngredient: Ingredient) => void;
  onCancel: () => void;
}

const EditIngredientModal: React.FC<EditIngredientModalProps> = ({
  row,
  storageMethods,
  onSave,
  onCancel,
}) => {
  const { deleteIngredient } = useIngredients(); // Context에서 삭제 함수 가져오기
  const [editedRow, setEditedRow] = useState({ ...row });
  const purchaseDateInput = useDateInput(row.purchaseDate || "");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const parsedPurchaseDate = purchaseDateInput.getParsedValue();

    const finalRow: Ingredient = {
      ...editedRow,
      purchaseDate: parsedPurchaseDate,
      quantity: editedRow.quantity <= 0 ? 1 : editedRow.quantity,
    };
    onSave(finalRow);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      setLoading(true);
      await deleteIngredient(row.ingredientId); // Context의 삭제 함수 호출
      alert("식재료가 성공적으로 삭제되었습니다.");
      onCancel(); // 모달 닫기
    } catch (error) {
      console.error("식재료 삭제 실패:", error);
      alert("식재료 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="식재료 수정" onClose={onCancel}>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              이름
            </th>
            <td style={{ width: "70%" }}>
              <Input
                id="ingredient-name"
                name="ingredient-name"
                type="text"
                value={editedRow.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="form-control"
              />
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              수량
            </th>
            <td style={{ width: "70%" }}>
              <Input
                id="ingredient-quantity"
                name="ingredient-quantity"
                type="number"
                value={editedRow.quantity || ""}
                onChange={(e) => handleChange("quantity", parseInt(e.target.value, 10) || 1)}
                className="form-control"
              />
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              카테고리
            </th>
            <td style={{ width: "70%" }}>
              <input
                id="ingredient-category"
                name="ingredient-category"
                type="text"
                value={editedRow.category?.categoryName || "알 수 없음"}
                readOnly
                className="form-control"
              />
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              저장방식
            </th>
            <td style={{ width: "70%" }}>
              <select
                id="ingredient-storagemethod"
                name="ingredient-storagemethod"
                value={editedRow.storageMethod?.id || ""}
                onChange={(e) =>
                  handleChange(
                    "storageMethod",
                    storageMethods.find((method) => method.id === parseInt(e.target.value, 10)) || {}
                  )
                }
                className="form-control"
              >
                {storageMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.storageMethodName}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              구매일자
            </th>
            <td style={{ width: "70%" }}>
              <Input
                id="ingredient-purchasedate"
                name="ingredient-purchasedate"
                type="text"
                {...purchaseDateInput}
                className="form-control"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-success" onClick={handleSave} disabled={loading}>
          저장
        </button>
        <button className="btn btn-warning" onClick={handleDelete} disabled={loading}>
          삭제
        </button>
        <button className="btn btn-danger" onClick={onCancel} disabled={loading}>
          취소
        </button>
      </div>
    </Modal>
  );
};

export default EditIngredientModal;
