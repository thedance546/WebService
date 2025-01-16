// src/features/MyIngredients/IngredientCard.tsx

import React from "react";
import { Ingredient, } from "../../types/EntityTypes";
import { IngredientStatus } from "../../types/FeatureTypes";
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

  let status = IngredientStatus.Safe;
  let backgroundColor = "";
  let badgeIcon = null;
  let expirationInfo = "";

  if (shelfLifeDate && currentDate <= shelfLifeDate) {
    status = IngredientStatus.Safe;
    backgroundColor = STATUS_COLORS.safe;
    expirationInfo = `유통기한: ${ingredient.shelfLife}`;
  } else if (
    shelfLifeDate &&
    consumeByDate &&
    currentDate > shelfLifeDate &&
    currentDate <= consumeByDate
  ) {
    status = IngredientStatus.Caution;
    backgroundColor = STATUS_COLORS.caution;
    badgeIcon = "⚠️";
    expirationInfo = `소비기한: ${ingredient.consumeBy}`;
  } else if (consumeByDate && currentDate > consumeByDate) {
    status = IngredientStatus.Expired;
    backgroundColor = STATUS_COLORS.expired;
    badgeIcon = "❗";
    expirationInfo = "소비기한 만료";
  }

  const ingredientIcon = getIconForIngredient(
    ingredient.name,
    ingredient.category?.categoryName
  );

  return (
    <div
      className="card"
      style={{
        width: "100%",
        maxWidth: "180px",
        height: "100px",
        padding: "0.75rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        textAlign: "left",
        cursor: "pointer",
        backgroundColor,
        position: "relative",
      }}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {ingredientIcon && (
          <img
            src={ingredientIcon}
            alt={`${ingredient.name || ingredient.category?.categoryName} 아이콘`}
            style={{
              width: "1.5em",
              height: "1.5em",
              objectFit: "contain",
            }}
          />
        )}
        <h5
          style={{
            fontSize: "1rem",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flexGrow: 1,
          }}
        >
          {ingredient.name}
        </h5>
        {badgeIcon && (
          <span
            style={{
              fontSize: "1rem",
              color: badgeIcon === "⚠️" ? "orange" : "red",
              marginLeft: "auto",
            }}
          >
            {badgeIcon}
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "4px",
        }}
      >
        <span style={{ fontSize: "0.9rem" }}>
          <strong>수량:</strong> {ingredient.quantity}
        </span>
      </div>

      <p
        style={{
          margin: "4px 0 0",
          fontSize: "0.8rem",
          color: status === IngredientStatus.Expired ? "red" : "black",
          fontWeight: status === IngredientStatus.Expired ? "bold" : "normal",
        }}
      >
        {expirationInfo}
      </p>
    </div>
  );
};

export default IngredientCard;
