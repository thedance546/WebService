// src/features/MyIngredients/IngredientCardContainer.tsx

import React, { useState, useMemo } from "react";
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
  const [activeSort, setActiveSort] = useState<string>("status"); // 기본 정렬 기준
  const [sortDirection, setSortDirection] = useState<boolean>(true); // true: 오름차순, false: 내림차순
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);

  const sortedIngredients = useMemo(() => {
    let sorted = [...ingredients];
    switch (activeSort) {
      case "status":
        sorted.sort((a, b) => {
          const aDate = a.consumeBy ? new Date(a.consumeBy).getTime() : Infinity;
          const bDate = b.consumeBy ? new Date(b.consumeBy).getTime() : Infinity;
          return sortDirection ? aDate - bDate : bDate - aDate;
        });
        break;
      case "name":
        sorted.sort((a, b) => {
          const comparison = a.name.localeCompare(b.name);
          return sortDirection ? comparison : -comparison;
        });
        break;
      case "quantity":
        sorted.sort((a, b) => (sortDirection ? b.quantity - a.quantity : a.quantity - b.quantity));
        break;
    }
    return sorted;
  }, [activeSort, sortDirection, ingredients]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedIngredients.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedIngredients.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div style={{ position: "relative", paddingBottom: "5rem" }}>
      <TopTabMenu
        activeSort={activeSort}
        sortDirection={sortDirection}
        onSortChange={(sortType) => {
          if (activeSort === sortType) {
            setSortDirection(!sortDirection);
          } else {
            setActiveSort(sortType);
            setSortDirection(true);
          }
        }}
        onAddClick={onAddClick}
      />

      <div
        className="ingredient-card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, max-content))",
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
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: pageNumber === currentPage ? "var(--primary-color)" : "transparent",
              color: pageNumber === currentPage ? "#fff" : "var(--primary-color)",
              border: `1px solid var(--primary-color)`,
              borderRadius: "4px",
              cursor: "pointer",
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
