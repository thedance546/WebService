// src/components/organisms/CommonHeader.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/matjipsa_logo_small.webp";
import title from "../../assets/matjipsa_title_nosub.webp";

interface CommonHeaderProps {
  pageTitle: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({ pageTitle }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/food/my-ingredients");
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start", // 왼쪽 정렬
        padding: "10px 20px", // 내부 패딩
        height: "60px", // 고정된 높이
        backgroundColor: "var(--background-color)", // 배경색
        borderBottom: "1px solid #ddd", // 하단 구분선
        boxSizing: "border-box", // 패딩 포함 크기 계산
      }}
    >
      {/* 로고 및 타이틀 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          marginRight: "20px", // 로고와 제목 간 간격
        }}
        onClick={handleLogoClick}
      >
        <img
          src={logo}
          alt="맛집사 로고"
          style={{ height: "40px", marginRight: "10px" }}
        />
        <img
          src={title}
          alt="맛집사 타이틀"
          style={{ height: "40px" }}
        />
      </div>

      {/* 페이지 제목 */}
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#333",
          margin: 0, // 여백 제거
          whiteSpace: "nowrap", // 줄바꿈 방지
          overflow: "hidden", // 초과 텍스트 숨김
          textOverflow: "ellipsis", // 생략 표시
          flex: 1, // 제목이 남은 공간 차지
          textAlign: "left", // 항상 왼쪽 정렬
        }}
      >
        {pageTitle}
      </h1>
    </header>
  );
};

export default CommonHeader;
