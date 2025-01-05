// src/features/MyIngredients/EditIngredientModal.tsx

import React, { useState } from 'react';
import Modal from '../../components/molecules/Modal';
import Input from '../../components/atoms/Input';
import { EditIngredientModalProps } from '../../types/FeatureTypes';

const EditIngredientModal: React.FC<EditIngredientModalProps> = ({ row, onSave, onCancel }) => {
  const [editedRow, setEditedRow] = useState({ ...row });

  const handleChange = (field: string, value: string | number) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const finalRow = { ...editedRow, quantity: editedRow.quantity <= 0 ? 1 : editedRow.quantity };
    onSave(finalRow);
  };

  return (
    <Modal title="식재료 수정" onClose={onCancel}>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: '30%' }}>이름</th>
            <td style={{ width: '70%' }}>
              <Input
                type="text"
                value={editedRow.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="form-control"
              />
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: '30%' }}>수량</th>
            <td style={{ width: '70%' }}>
              <Input
                type="number"
                value={editedRow.quantity || ""}
                onChange={(e) => handleChange("quantity", parseInt(e.target.value, 10) || "")}
                className="form-control"
              />
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: '30%' }}>카테고리</th>
            <td style={{ width: '70%' }}>
              <Input
                type="text"
                value={editedRow.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
                className="form-control"
              />
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: '30%' }}>보관방법</th>
            <td style={{ width: '70%' }}>
              <Input
                type="text"
                value={editedRow.storage || ""}
                onChange={(e) => handleChange("storage", e.target.value)}
                className="form-control"
              />
            </td>
          </tr>
          <tr>
            <th className="text-end align-middle text-nowrap" style={{ width: '30%' }}>구매일자</th>
            <td style={{ width: '70%' }}>
              <Input
                type="date"
                value={editedRow.purchaseDate || ""}
                onChange={(e) => handleChange("purchaseDate", e.target.value)}
                className="form-control"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-success" onClick={handleSave}>저장</button>
        <button className="btn btn-danger" onClick={onCancel}>취소</button>
      </div>
    </Modal>
  );
};

export default EditIngredientModal;
