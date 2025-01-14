// src/features/MyIngredients/IngredientCardContainer.tsx

import React, { useState, useEffect } from "react";
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
  const [activeTab, setActiveTab] = useState<string>("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // 기본 값
  const [, setColumns] = useState(3); // 기본 열 수

  useEffect(() => {
    const calculateItemsPerPage = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 최소 열 수와 행 수 설정
      const minCols = 1;
      const minRows = 1;

      const cols = Math.max(Math.floor(width / 200), minCols); // 최소 열 개수 보장
      const rows = Math.max(Math.floor(height / 150), minRows); // 최소 행 개수 보장

      setColumns(cols);
      setItemsPerPage(cols * rows);
    };

    calculateItemsPerPage(); // 초기 계산
    window.addEventListener("resize", calculateItemsPerPage); // 리사이즈 이벤트 등록

    return () => {
      window.removeEventListener("resize", calculateItemsPerPage); // 이벤트 제거
    };
  }, []);

  const filteredIngredients =
    activeTab === "전체"
      ? ingredients
      : ingredients.filter(
          (item) => String(item.storageMethod?.storageMethodName) === activeTab
        );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIngredients.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

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
          bottom: "5rem", // 네비게이션 바로 위
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
