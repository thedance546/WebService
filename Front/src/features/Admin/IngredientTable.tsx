// src/features/Admin/IngredientTable.tsx

import React from "react";
import Button from "../../components/atoms/Button";

interface Ingredient {
  id: string;
  name: string;
  categoryName?: string;
  storageMethodName?: string;
  shelfLife?: { sellByDays: number; useByDays: number };
}

interface IngredientTableProps {
  ingredients: Ingredient[];
  onDeleteIngredient: (id: string) => void;
}

const IngredientTable: React.FC<IngredientTableProps> = ({ ingredients, onDeleteIngredient }) => {
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
        {ingredients.map((ingredient) => (
          <tr key={ingredient.id}>
            <td>{ingredient.id}</td>
            <td>{ingredient.name}</td>
            <td>{ingredient.categoryName}</td>
            <td>{ingredient.storageMethodName}</td>
            <td>{ingredient.shelfLife?.sellByDays}</td>
            <td>{ingredient.shelfLife?.useByDays}</td>
            <td>
              <Button
                className="btn btn-danger"
                onClick={() => onDeleteIngredient(ingredient.id)}
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
