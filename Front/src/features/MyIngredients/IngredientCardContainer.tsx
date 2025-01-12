// src/features/MyIngredients/IngredientCardContainer.tsx

import React, { useState } from "react";
import { useIngredients } from "../../contexts/IngredientsContext";
import TopTabMenu from "./TopTabMenu";
import IngredientCard from "./IngredientCard";
import { Ingredient } from "../../types/EntityTypes";

interface IngredientCardContainerProps {
  onAddClick: () => void;
  onCardClick: (ingredient: Ingredient) => void;
}

const IngredientCardContainer: React.FC<IngredientCardContainerProps> = ({
  onAddClick,
  onCardClick,
}) => {
  const { ingredients } = useIngredients();
  const [activeTab, setActiveTab] = useState<string>("전체"); // 로컬 상태로 관리
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredIngredients =
    activeTab === "전체"
      ? ingredients
      : ingredients.filter((item) => String(item.storageMethod?.storageMethodName) === activeTab);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIngredients.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ position: "relative", paddingBottom: "5rem" }}>
      <TopTabMenu
        activeTab={activeTab}
        onTabClick={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
        onAddClick={onAddClick}
      />
      <div
        className="ingredient-card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        {currentItems.map((ingredient) => (
          <IngredientCard
            key={ingredient.ingredientId}
            ingredient={ingredient}

            onClick={() => onCardClick(ingredient)}
          />
        ))}
      </div>

      <div
        className="pagination"
        style={{
          position: "fixed",
          bottom: "5rem",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            style={{
              margin: "0 0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: pageNumber === currentPage ? "var(--primary-color)" : "transparent",
              color: pageNumber === currentPage ? "#fff" : "var(--primary-color)",
              border: `1px solid var(--primary-color)`,
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IngredientCardContainer;
