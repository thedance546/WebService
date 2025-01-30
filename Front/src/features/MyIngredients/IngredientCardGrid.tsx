// src/features/MyIngredients/IngredientCardGrid.tsx

import React from "react";
import IngredientCard from "./IngredientCard";
import { Ingredient } from "../../types/EntityTypes";

interface IngredientCardGridProps {
  items: Ingredient[];
  columns: number;
  onCardClick: (ingredient: Ingredient) => void;
}

const IngredientCardGrid: React.FC<IngredientCardGridProps> = ({ items, columns, onCardClick }) => {
  return (
    <div
      className="ingredient-card-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "16px",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      {items.map((ingredient) => (
        <IngredientCard
          key={ingredient.ingredientId}
          ingredient={ingredient}
          onClick={() => onCardClick(ingredient)}
        />
      ))}
    </div>
  );
};

export default IngredientCardGrid;
