// src/features/MyIngredients/CategoryTabs.tsx

import React from "react";
import { STORAGE_METHODS } from "../../constants/storageMethods";

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
      overflowX: "auto", // 스크롤 기능은 유지
    }}
  >
    <style>
      {`
      /* Chrome, Edge, Safari */
      .top-tab-menu::-webkit-scrollbar {
        display: none; /* 스크롤바 숨기기 */
      }

      /* Firefox */
      .top-tab-menu {
        scrollbar-width: none; /* 스크롤바 숨기기 */
      }

      /* IE 10+ */
      .top-tab-menu {
        -ms-overflow-style: none; /* 스크롤바 숨기기 */
      }
    `}
    </style>
    <div
      className="d-flex align-items-center"
      style={{
        overflowX: "auto",
        whiteSpace: "nowrap", // 버튼 줄 바꿈 방지
      }}
    >
      {STORAGE_METHODS.map((method) => (
        <button
          key={method.id}
          className={`btn mx-2 ${activeTab === method.name ? "btn-primary" : "btn-outline-secondary"
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