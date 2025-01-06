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
      width: "180px",
      padding: "1rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      textAlign: "left",
      cursor: "pointer",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
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
