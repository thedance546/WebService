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
  const [activeSort, setActiveSort] = useState<string>("status"); // 기본 정렬 기준
  const [sortDirection, setSortDirection] = useState<boolean>(true); // true: 오름차순, false: 내림차순
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12); // 기본 값
  const [columns, setColumns] = useState<number>(3); // 기본 열 수

  // 화면 크기에 따라 동적으로 아이템 수 계산
  useEffect(() => {
    const calculateItemsPerPage = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 여유 공간 고려
      const headerHeight = 60; // TopTabMenu 높이
      const footerHeight = 80; // 페이지네이션 높이
      const availableHeight = height - headerHeight - footerHeight;

      // 카드 크기 및 간격 설정
      const cardWidth = 200;
      const cardHeight = 150;
      const horizontalGap = 16; // 카드 간격
      const verticalGap = 16;

      // 계산된 열과 행 수
      const cols = Math.floor((width + horizontalGap) / (cardWidth + horizontalGap));
      const rows = Math.floor((availableHeight + verticalGap) / (cardHeight + verticalGap));

      // 상태 업데이트
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
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "16px",
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
