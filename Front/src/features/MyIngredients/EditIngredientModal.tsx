// src/features/MyIngredients/EditIngredientModal.tsx

import React, { useState } from "react";
import Modal from "../../components/molecules/Modal";
import Input from "../../components/atoms/Input";
import { Ingredient, StorageMethod } from "../../types/EntityTypes";
import useDateInput from "../../hooks/useDateInput";

export interface EditIngredientModalProps {
  row: Ingredient;
  storageMethods: StorageMethod[];
  onSave: (updatedIngredient: Ingredient) => void;
  onDelete: (ingredientId: number) => void;
  onCancel: () => void;
}

const EditIngredientModal: React.FC<EditIngredientModalProps> = ({
  row,
  storageMethods,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [editedRow, setEditedRow] = useState({ ...row });
  const purchaseDateInput = useDateInput(row.purchaseDate || "");

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
        <button className="btn btn-success" onClick={handleSave}>
          저장
        </button>
        <button className="btn btn-warning" onClick={() => onDelete(row.ingredientId)}>
          삭제
        </button>
        <button className="btn btn-danger" onClick={onCancel}>
          취소
        </button>
      </div>
    </Modal>
  );
};

export default EditIngredientModal;
