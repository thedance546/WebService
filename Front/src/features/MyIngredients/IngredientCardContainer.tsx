// src/features/MyIngredients/IngredientCardContainer.tsx

import React, { useState, useEffect, useMemo } from "react";
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
  const [activeSort, setActiveSort] = useState<string>("status");
  const [sortDirection, setSortDirection] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [columns, setColumns] = useState<number>(3);

  useEffect(() => {
    const calculateItemsPerPage = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const headerHeight = 60; // TopTabMenu 높이
      const footerHeight = 120; // 페이지네이션 높이 + 여유 공간
      const availableHeight = height - headerHeight - footerHeight;

      const cardWidth = 200;
      const cardHeight = 120; // 카드 높이 유지
      const horizontalGap = 16;
      const verticalGap = 16;

      const cols = Math.floor((width + horizontalGap) / (cardWidth + horizontalGap));
      const rows = Math.floor((availableHeight + verticalGap) / (cardHeight + verticalGap));

      setColumns(cols);
      setItemsPerPage(cols * rows);
    };

    calculateItemsPerPage();
    window.addEventListener("resize", calculateItemsPerPage);

    return () => {
      window.removeEventListener("resize", calculateItemsPerPage);
    };
  }, []);

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
    <div style={{ position: "relative", paddingBottom: "7rem" }}>
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
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "16px",
          padding: "1rem",
          overflowY: "auto", // 내부 스크롤 추가
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
