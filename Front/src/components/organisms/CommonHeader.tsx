// src/components/organisms/CommonHeader.tsx

import React from "react";
import logo from "../../assets/matjipsa_logo_128.webp";
import title from "../../assets/matjipsa_title_small.webp";

interface CommonHeaderProps {
  pageTitle: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({ pageTitle }) => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "left",
        padding: "10px 20px",
        backgroundColor: "var(--back-ground)",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* 로고 */}
      <div style={{ display: "flex", alignItems: "left", marginRight: "20px" }}>
        <img
          src={ logo }
          alt="맛집사 로고"
          style={{ height: "40px", alignItems: "left", marginRight: "10px" }}
        />
        <img
          src={ title }
          alt="맛집사 타이틀"
          style={{ height: "40px", alignItems: "left" }}
        />
      </div>

      {/* 페이지 제목 */}
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          margin: 0,
          color: "#333",
          flex: 1,
          textAlign: "left",
        }}
      >
        {pageTitle}
      </h1>
    </header>
  );
};

export default CommonHeader;
