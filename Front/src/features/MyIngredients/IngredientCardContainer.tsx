// src/features/MyIngredients/IngredientCardContainer.tsx

import React, { useState, useEffect } from "react";
import { useIngredients } from "../../contexts/IngredientsContext";
import TopTabMenu from "./TopTabMenu";
import IngredientFilter from "./IngredientFilter";
import PaginationControls from "./PaginationControls";
import IngredientCardGrid from "./IngredientCardGrid";
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
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    const calculateItemsPerPage = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const minWidth = 160;
      const minHeight = 120;
      const cardWidth = 180;
      const cardHeight = 120;
      const horizontalGap = 8;
      const verticalGap = 8;

      const headerHeight = 60;
      const footerHeight = 120;
      const availableWidth = Math.max(width, minWidth);
      const availableHeight = Math.max(height - headerHeight - footerHeight, minHeight);

      const cols = Math.max(1, Math.floor((availableWidth + horizontalGap) / (cardWidth + horizontalGap)));
      const rows = Math.max(1, Math.floor((availableHeight + verticalGap) / (cardHeight + verticalGap)));

      setColumns(cols);
      setItemsPerPage(cols * rows);
    };

    calculateItemsPerPage();
    window.addEventListener("resize", calculateItemsPerPage);

    return () => {
      window.removeEventListener("resize", calculateItemsPerPage);
    };
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIngredients.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);

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

      <IngredientFilter
        ingredients={ingredients}
        activeSort={activeSort}
        sortDirection={sortDirection}
        onFilter={setFilteredIngredients}
      />

      <IngredientCardGrid
        items={currentItems}
        columns={columns}
        onCardClick={onCardClick}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default IngredientCardContainer;
