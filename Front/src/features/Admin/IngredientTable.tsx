// src/features/Admin/IngredientTable.tsx

import React from "react";
import Button from "../../components/atoms/Button";

interface Ingredient {
  id: string;
  itemName: string;
  category?: { categoryName: string };
  storageMethod?: { storageMethodName: string };
  shelfLife?: { sellByDays: number; useByDays: number };
}

interface IngredientTableProps {
  items: Ingredient[];
  onRemoveItem: (id: string) => void;
}

const IngredientTable: React.FC<IngredientTableProps> = ({ items, onRemoveItem }) => {
  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>이름</th>
          <th>카테고리</th>
          <th>보관방법</th>
          <th>유통기한 (일)</th>
          <th>소비기한 (일)</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.itemName}</td>
            <td>{item.category?.categoryName}</td>
            <td>{item.storageMethod?.storageMethodName}</td>
            <td>{item.shelfLife?.sellByDays}</td>
            <td>{item.shelfLife?.useByDays}</td>
            <td>
              <Button
                className="btn btn-danger"
                onClick={() => onRemoveItem(item.id)}
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
