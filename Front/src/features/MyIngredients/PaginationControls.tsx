// src/features/MyIngredients/PaginationControls.tsx

import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
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
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: index + 1 === currentPage ? "var(--primary-color)" : "transparent",
            color: index + 1 === currentPage ? "#fff" : "var(--primary-color)",
            border: `1px solid var(--primary-color)`,
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s",
          }}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default PaginationControls;
