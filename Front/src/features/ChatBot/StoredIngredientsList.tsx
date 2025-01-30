// src/components/StoredIngredientsList.tsx

import React, { useState } from 'react';
import { Ingredient } from '../../types/EntityTypes';

interface StoredIngredientsListProps {
  ingredients: Ingredient[];
  onSelectionChange: (selected: Ingredient[]) => void;
}

const StoredIngredientsList: React.FC<StoredIngredientsListProps> = ({ ingredients, onSelectionChange }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(new Set());

  const toggleSelection = (ingredientId: number) => {
    setSelectedIngredients((prevSelected) => {
      const updated = new Set(prevSelected);
      if (updated.has(ingredientId)) {
        updated.delete(ingredientId);
      } else {
        updated.add(ingredientId);
      }
      onSelectionChange(ingredients.filter((ingredient) => updated.has(ingredient.ingredientId))); // 선택된 식재료 전달
      return updated;
    });
  };

  return (
    <div className="stored-ingredients mt-4 p-3 border rounded bg-light">
      <h5>내 식재료 목록</h5>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>선택</th>
              <th style={{ width: '40%' }}>이름</th>
              <th style={{ width: '25%' }}>수량</th>
              <th style={{ width: '25%' }}>구매일자</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.slice(0, 10).map((ingredient) => (
              <tr key={ingredient.ingredientId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIngredients.has(ingredient.ingredientId)}
                    onChange={() => toggleSelection(ingredient.ingredientId)}
                  />
                </td>
                <td>{ingredient.name}</td>
                <td>{ingredient.quantity}</td>
                <td>{ingredient.purchaseDate || '미입력'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoredIngredientsList;

