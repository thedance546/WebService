// src/features/NewIngredients/IngredientCard.tsx

import React from "react";
import { Ingredient } from "../../types/EntityTypes";

interface IngredientCardProps {
  ingredient: Ingredient;
  onClick: () => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient, onClick }) => (
  <div
    className="card"
    style={{
      padding: "1rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      textAlign: "center",
      cursor: "pointer",
      width: "200px", // 고정 너비
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap", // 줄바꿈 방지
    }}
    onClick={onClick}
  >
    <h5 className="card-title">{ingredient.name}</h5>
    <p>
      <strong>수량:</strong> {ingredient.quantity}
      <br />
      <strong>D-day:</strong> {ingredient.purchaseDate}
    </p>
  </div>

);

export default IngredientCard;
