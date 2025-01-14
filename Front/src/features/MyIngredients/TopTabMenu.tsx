// src/features/MyIngredients/TopTabMenu.tsx

import React from "react";

interface TopTabMenuProps {
  activeSort: string;
  sortDirection: boolean;
  onSortChange: (sortType: string) => void;
  onAddClick: () => void;
}

const TopTabMenu: React.FC<TopTabMenuProps> = ({
  activeSort,
  sortDirection,
  onSortChange,
  onAddClick,
}) => {
  return (
    <div
      className="top-tab-menu d-flex align-items-center justify-content-between px-3 py-2 container"
      style={{
        position: "sticky",
        top: 0,
        overflowX: "auto",
      }}
    >
      <style>
        {`
          .top-tab-menu .tab-active {
            background-color: var(--primary-color);
            color: white;
            border: none;
          }

          .top-tab-menu .tab-inactive {
            background-color: transparent;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
          }

          .top-tab-menu .tab-inactive:hover {
            background-color: var(--primary-color);
            color: white;
          }
        `}
      </style>
      <div className="d-flex align-items-center gap-3">
        <button
          className={`btn ${activeSort === "status" ? "tab-active" : "tab-inactive"}`}
          style={{
            borderRadius: "20px",
            whiteSpace: "nowrap",
            padding: "8px 16px",
          }}
          onClick={() => onSortChange("status")}
        >
          상태 {sortDirection ? "↑" : "↓"}
        </button>
        <button
          className={`btn ${activeSort === "name" ? "tab-active" : "tab-inactive"}`}
          style={{
            borderRadius: "20px",
            whiteSpace: "nowrap",
            padding: "8px 16px",
          }}
          onClick={() => onSortChange("name")}
        >
          이름 {sortDirection ? "↑" : "↓"}
        </button>
        <button
          className={`btn ${activeSort === "quantity" ? "tab-active" : "tab-inactive"}`}
          style={{
            borderRadius: "20px",
            whiteSpace: "nowrap",
            padding: "8px 16px",
          }}
          onClick={() => onSortChange("quantity")}
        >
          수량 {sortDirection ? "↑" : "↓"}
        </button>
      </div>
      <button
        className="btn btn-success"
        style={{ borderRadius: "20px", whiteSpace: "nowrap", padding: "8px 16px" }}
        onClick={onAddClick}
      >
        + 식재료 추가
      </button>
    </div>
  );
};

export default TopTabMenu;
