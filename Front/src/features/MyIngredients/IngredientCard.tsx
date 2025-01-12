// src/features/MyIngredients/IngredientCard.tsx

import React from "react";
import { Ingredient } from "../../types/EntityTypes";
import { STATUS_COLORS } from "../../constants/IngredientsNotiColor";
import { getIconForIngredient } from "../../utils/LoadIcons";

interface IngredientCardProps {
  ingredient: Ingredient;
  onClick: () => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient, onClick }) => {
  const currentDate = new Date();
  const shelfLifeDate = ingredient.shelfLife ? new Date(ingredient.shelfLife) : null;
  const consumeByDate = ingredient.consumeBy ? new Date(ingredient.consumeBy) : null;

  let status = "";
  let backgroundColor = "";
  let badgeIcon = null;

  // 조건 1: 유통기한 이전
  if (shelfLifeDate && currentDate <= shelfLifeDate) {
    status = "안전";
    backgroundColor = STATUS_COLORS.safe;
  }
  // 조건 2: 소비기한 이전 (유통기한 지났으나 소비기한 이전)
  else if (
    shelfLifeDate &&
    consumeByDate &&
    currentDate > shelfLifeDate &&
    currentDate <= consumeByDate
  ) {
    status = "주의";
    backgroundColor = STATUS_COLORS.caution;
    badgeIcon = "⚠️"; // 경고 아이콘
  }
  // 조건 3: 소비기한 이후 (만료)
  else if (consumeByDate && currentDate > consumeByDate) {
    status = "위험";
    backgroundColor = STATUS_COLORS.expired;
    badgeIcon = "❗"; // 위험 아이콘
  }

  // 이름 또는 카테고리를 기준으로 아이콘 가져오기
  const ingredientIcon = getIconForIngredient(
    ingredient.name,
    ingredient.category?.categoryName
  );

  return (
    <div
      className="card"
      style={{
        width: "180px",
        height: "135px",
        padding: "0.75rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        textAlign: "left",
        cursor: "pointer",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        backgroundColor,
        position: "relative",
      }}
      onClick={onClick}
    >
      {/* 경고/위험 배지 아이콘 */}
      {badgeIcon && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            fontSize: "1.5rem",
            color: badgeIcon === "⚠️" ? "orange" : "red", // 아이콘 색상 지정
          }}
        >
          {badgeIcon}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* 아이콘 */}
        {ingredientIcon && (
          <img
            src={ingredientIcon}
            alt={`${ingredient.name || ingredient.category?.categoryName} 아이콘`}
            style={{
              width: "1em",
              height: "1em",
              objectFit: "contain",
              position: "relative",
              top: "-2px",
            }}
          />
        )}
        <h5 className="card-title">{ingredient.name}</h5>
      </div>

      <p>
        <strong>수량:</strong> {ingredient.quantity}
        <br />
        <strong>{status}</strong>
        <br />
        {status === "안전" || status === "주의" ? (
          <span>유통기한: {ingredient.shelfLife}</span>
        ) : (
          <span>소비기한: {ingredient.consumeBy}</span>
        )}
      </p>
    </div>
  );
};

export default IngredientCard;
