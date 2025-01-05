// src/features/NewIngredients/AddingIngredientButton.tsx

import React from "react";

interface AddIngredientButtonProps {
  onClick: () => void;
}

const AddIngredientButton: React.FC<AddIngredientButtonProps> = ({ onClick }) => (
  <div
    className="card text-center"
    style={{
      padding: "1rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      cursor: "pointer",
      color: "green",
      fontWeight: "bold",
    }}
    onClick={onClick}
  >
    + 식재료 등록
  </div>
);

export default AddIngredientButton;
