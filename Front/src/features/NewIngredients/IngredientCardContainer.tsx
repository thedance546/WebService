// src/features/NewIngredients/IngredientCardContainer.tsx

import React from "react";
import { useIngredients } from "../../contexts/IngredientsContext";
import CategoryTabs from "./CategoryTabs";
import IngredientCard from "./IngredientCard";

const IngredientCardContainer: React.FC = () => {
  const { ingredients, categories, activeTab, setActiveTab } = useIngredients();

  const filteredIngredients =
    activeTab === "전체"
      ? ingredients
      : ingredients.filter(
          (item) => item.categoryId === categories.indexOf(activeTab)
        );

  return (
    <div>
      {/* 카테고리 필터 */}
      <CategoryTabs
        categories={categories}
        activeTab={activeTab}
        onTabClick={setActiveTab}
        onAddClick={() => console.log("카테고리 추가 버튼 클릭")}
      />

      {/* 식재료 카드 그리드 */}
      <div
        className="ingredient-card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        {filteredIngredients.map((ingredient) => (
          <IngredientCard
            key={ingredient.ingredientId}
            ingredient={ingredient}
            onClick={() => console.log("카드 클릭", ingredient)}
          />
        ))}
      </div>
    </div>
  );
};

export default IngredientCardContainer;
