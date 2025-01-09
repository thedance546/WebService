// src/features/MyIngredients/IngredientCard.tsx

import React from "react";
import { Ingredient } from "../../types/EntityTypes";
import { calculateDate } from "../../utils/Utils";
import { STATUS_COLORS } from "../../constants/IngredientsNotiColors";

interface IngredientCardProps {
  ingredient: Ingredient;
  onClick: () => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient, onClick }) => {
  const currentDate = new Date();

  let status = "";
  let backgroundColor = "";

  const isShelfLifeNear = (date: string | undefined) => {
    if (!date) return false;
    const nearDate = new Date(calculateDate(date, -2)); // 유통기한 2일 전
    return currentDate > nearDate && currentDate <= new Date(date);
  };

  const isConsumeByNear = (date: string | undefined) => {
    if (!date) return false;
    const nearDate = new Date(calculateDate(date, -2)); // 소비기한 2일 전
    return currentDate > nearDate && currentDate <= new Date(date);
  };

  if (ingredient.shelfLife && currentDate <= new Date(ingredient.shelfLife)) {
    // 유통기한 이내
    status = "유통기한 이내";
    backgroundColor = STATUS_COLORS.safe;
  } else if (
    ingredient.shelfLife &&
    currentDate > new Date(ingredient.shelfLife) &&
    ingredient.consumeBy &&
    currentDate <= new Date(ingredient.consumeBy)
  ) {
    // 유통기한 경과, 소비기한 이내
    status = "소비기한 이내";
    backgroundColor = STATUS_COLORS.withinConsume;
  } else if (ingredient.consumeBy && currentDate > new Date(ingredient.consumeBy)) {
    // 소비기한 만료
    status = "소비기한 만료";
    backgroundColor = STATUS_COLORS.expired;
  }

  if (isShelfLifeNear(ingredient.shelfLife)) {
    // 유통기한 임박
    status = "유통기한 임박";
    backgroundColor = STATUS_COLORS.nearShelfLife;
  } else if (isConsumeByNear(ingredient.consumeBy)) {
    // 소비기한 임박
    status = "소비기한 임박";
    backgroundColor = STATUS_COLORS.nearConsume;
  }

  return (
    <div
      className="card"
      style={{
        width: "180px",
        height: "150px",
        padding: "0.75rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        textAlign: "left",
        cursor: "pointer",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        backgroundColor, // 상태에 따라 동적 색상 적용
      }}
      onClick={onClick}
    >
      <h5 className="card-title">{ingredient.name}</h5>
      <p>
        <strong>수량:</strong> {ingredient.quantity}
        <br />
        <strong>{status}</strong>
        <br />
        {status === "유통기한 이내" || status === "유통기한 임박" ? (
          <span>유통기한: {ingredient.shelfLife}</span>
        ) : (
          <span>소비기한: {ingredient.consumeBy}</span>
        )}
      </p>
    </div>
  );
};

export default IngredientCard;
