// src/features/NewIngredients/CategoryTabs.tsx

import React from "react";

interface CategoryTabsProps {
  categories: string[];
  activeTab: string;
  onTabClick: (category: string) => void;
  onAddClick: () => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeTab, onTabClick, onAddClick }) => (
  <div
    className="category-tabs d-flex align-items-center justify-content-between px-3 py-2 container"
    style={{
      position: "sticky",
      top: 0,
      //backgroundColor: "#fff",
      //zIndex: 10,
      //borderBottom: "1px solid #ddd",
    }}
  >
    <div className="d-flex align-items-center" style={{ overflowX: "auto" }}>
      {categories.map((category) => (
        <button
          key={category}
          className={`btn mx-2 ${activeTab === category ? "btn-primary" : "btn-outline-secondary"}`}
          style={{
            borderRadius: "20px",
            whiteSpace: "nowrap",
            padding: "8px 16px",
            flexShrink: 0,
          }}
          onClick={() => onTabClick(category)}
        >
          {category}
        </button>
      ))}
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

export default CategoryTabs;
