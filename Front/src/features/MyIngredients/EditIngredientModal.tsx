// src/features/MyIngredients/EditIngredientModal.tsx

import React, { useState } from "react";
import Modal from "../../components/molecules/Modal";
import { Ingredient } from "../../types/EntityTypes";

export interface EditIngredientModalProps {
  row: Ingredient;
  onSave: (updatedIngredient: Ingredient) => void;
  onCancel: () => void;
}

const EditIngredientModal: React.FC<EditIngredientModalProps> = ({
  row,
  onSave,
  onCancel,
}) => {
  const [editedRow, setEditedRow] = useState({ ...row });
  const [loading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const finalRow: Ingredient = {
      ...editedRow,
      quantity: editedRow.quantity <= 0 ? 1 : editedRow.quantity,
    };
    onSave(finalRow);
  };

  return (
    <Modal title="식재료 상세정보" onClose={onCancel}>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              이름
            </th>
            <td style={{ width: "70%" }}>
              <input
                type="text"
                value={editedRow.name || "알 수 없음"}
                readOnly
                className="form-control"
              />
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              수량
            </th>
            <td style={{ width: "70%" }}>
              <input
                type="number"
                value={editedRow.quantity || ""}
                onChange={(e) =>
                  handleChange("quantity", parseInt(e.target.value, 10) || 1)
                }
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
              <input
                type="text"
                value={editedRow.storageMethod?.storageMethodName || "알 수 없음"}
                readOnly
                className="form-control"
              />
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              구매일자
            </th>
            <td style={{ width: "70%" }}>
              <input
                type="text"
                value={editedRow.purchaseDate || "알 수 없음"}
                readOnly
                className="form-control"
              />
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              유통기한
            </th>
            <td style={{ width: "70%" }}>
              <input
                type="text"
                value={editedRow.shelfLife || "알 수 없음"}
                readOnly
                className="form-control"
              />
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: "30%" }}>
              소비기한
            </th>
            <td style={{ width: "70%" }}>
              <input
                type="text"
                value={editedRow.consumeBy || "알 수 없음"}
                readOnly
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
        <button className="btn btn-danger" onClick={onCancel} disabled={loading}>
          닫기
        </button>
      </div>
    </Modal>
  );
};

export default EditIngredientModal;
