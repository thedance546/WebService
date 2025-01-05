// src/features/NewIngredients/CategoryTabs.tsx

import React from "react";

interface CategoryTabsProps {
  categories: string[];
  activeTab: string;
  onTabClick: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeTab, onTabClick }) => (
  <div className="d-flex justify-content-center mb-4 flex-wrap">
    {categories.map((category) => (
      <button
        key={category}
        className={`btn btn-${activeTab === category ? "primary" : "outline-primary"} mx-1 mb-2`}
        onClick={() => onTabClick(category)}
      >
        {category}
      </button>
    ))}
  </div>
);

export default CategoryTabs;
