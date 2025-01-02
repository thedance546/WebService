// src/features/Admin/ItemTable.tsx

import React from "react";
import Button from "../../components/atoms/Button";
import { Item } from "../../types/EntityTypes";

interface IngredientTableProps {
  items: Item[];
  onDeleteItem: (id: number) => void;
}

const IngredientTable: React.FC<IngredientTableProps> = ({ items, onDeleteItem }) => {
  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>이름</th>
          <th>카테고리</th>
          <th>보관방법</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.itemName}</td> {/* itemName으로 유지 */}
            <td>{item.category?.categoryName || "N/A"}</td>
            <td>{item.storageMethod?.storageMethodName || "N/A"}</td>
            <td>
              <Button
                className="btn btn-danger"
                onClick={() => onDeleteItem(item.id)}
              >
                삭제
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default IngredientTable;
