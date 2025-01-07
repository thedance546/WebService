// src/features/MyIngredients/IngredientCardContainer.tsx

import React, { useState, useEffect } from "react";
import { useIngredients } from "../../contexts/IngredientsContext";
import CategoryTabs from "./CategoryTabs";
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
  const { ingredients, categories, activeTab, setActiveTab } = useIngredients();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // 초기값
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // 카드 크기와 간격 기준으로 한 페이지 카드 수 계산
      const cardWidth = 180; // 카드 가로 크기 (px)
      const cardHeight = 200; // 카드 세로 크기 (px)
      const gap = 20; // 카드 간격 (px)

      const cardsPerRow = Math.floor((window.innerWidth - 40) / (cardWidth + gap)); // 가로 카드 수
      const rowsPerPage = Math.floor((window.innerHeight - 160) / (cardHeight + gap)); // 세로 카드 수
      setItemsPerPage(cardsPerRow * rowsPerPage);
    };

    handleResize(); // 초기 크기 계산
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize); // 이벤트 정리
  }, []);

  const filteredIngredients =
    activeTab === "전체"
      ? ingredients
      : ingredients.filter(
          (item) => item.categoryId === categories.indexOf(activeTab)
        );

  // 현재 페이지에 해당하는 카드 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIngredients.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* 카테고리 필터 */}
      <CategoryTabs
        categories={categories}
        activeTab={activeTab}
        onTabClick={setActiveTab}
        onAddClick={onAddClick}
      />

      {/* 식재료 카드 그리드 */}
      <div
        className="ingredient-card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(180px, 1fr))`,
          gap: "20px",
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

      {/* 페이지네이션 */}
      <div className="pagination" style={{ textAlign: "center", marginTop: "1rem" }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            style={{
              margin: "0 0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: pageNumber === currentPage ? "#007bff" : "#f8f9fa",
              color: pageNumber === currentPage ? "#fff" : "#000",
              border: "1px solid #dee2e6",
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
