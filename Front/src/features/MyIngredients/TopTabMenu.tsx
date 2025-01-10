// src/features/MyIngredients/CategoryTabs.tsx

import React from "react";
import { STORAGE_METHODS } from "../../constants/sss";

interface TopTabMenuProps {
  activeTab: string;
  onTabClick: (tab: string) => void;
  onAddClick: () => void;
}

const TopTabMenu: React.FC<TopTabMenuProps> = ({ activeTab, onTabClick, onAddClick }) => (
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
    <div
      className="d-flex align-items-center"
      style={{
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
    >
      {STORAGE_METHODS.map((method) => (
        <button
          key={method.id}
          className={`btn mx-2 ${
            activeTab === method.name ? "tab-active" : "tab-inactive"
          }`}
          style={{
            borderRadius: "20px",
            whiteSpace: "nowrap",
            padding: "8px 16px",
            flexShrink: 0,
          }}
          onClick={() => onTabClick(method.name)}
        >
          {method.displayName}
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

export default TopTabMenu;
