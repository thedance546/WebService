// src/features/NewIngredients/IngredientCard.tsx

import React from "react";

interface IngredientCardProps {
  ingredient: {
    name: string;
    category: string;
    storage: string;
    shelfLife: number;
    consumeBy: number;
  };
  onClick: () => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient, onClick }) => {
  return (
    <div
      className="card m-2"
      style={{
        width: "18rem",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      onClick={onClick}
    >
      <div className="card-body">
        <h5 className="card-title">{ingredient.name}</h5>
        <p className="card-text">
          <strong>카테고리:</strong> {ingredient.category}
          <br />
          <strong>보관:</strong> {ingredient.storage}
          <br />
          <strong>소비기한:</strong> {ingredient.consumeBy}일
        </p>
      </div>
    </div>
  );
};

export default IngredientCard;
