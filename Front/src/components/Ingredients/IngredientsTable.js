// src/components/Ingredients/IngredientsTable.js
import React, { useState, useEffect } from "react";
import "./IngredientsTable.css"; // CSS 추가

const IngredientsTable = ({ data }) => {
  const [filter, setFilter] = useState("전체");
  const [dateType, setDateType] = useState("유통기한");
  const [defaultDate, setDefaultDate] = useState(""); // 기본 구매일자 설정

  useEffect(() => {
    // 오늘 날짜를 "YYYY-MM-DD" 형식으로 변환하여 기본값 설정
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setDefaultDate(formattedDate);
  }, []);

  const filteredData = data.map((item) => ({
    ...item,
    quantity: item.quantity || 1, // 기본 수량 1 설정
    purchaseDate: item.purchaseDate || defaultDate, // 기본 구매일자 설정
  })).filter((item) =>
    filter === "전체" ? true : item.storage === filter
  );

  const toggleDateType = () => {
    setDateType((prev) => (prev === "유통기한" ? "소비기한" : "유통기한"));
  };

  return (
    <div className="container-fluid px-0"> {/* 여백 최소화 */}
      {/* 필터 드롭다운 */}
      <div className="d-flex justify-content-between mb-3 px-2">
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="전체">전체</option>
          <option value="냉장">냉장</option>
          <option value="냉동">냉동</option>
          <option value="상온">상온</option>
        </select>
      </div>

      {/* 반응형 테이블 */}
      <div className="table-responsive-scrollable"> {/* 커스텀 스크롤 가능 테이블 */}
        <table className="table table-striped table-bordered text-center table-nowrap">
          <thead className="table-light">
            <tr>
              <th className="col-3">이름</th>
              <th className="col-2">수량</th>
              <th
                className="col-3"
                style={{ cursor: "pointer" }}
                onClick={toggleDateType}
              >
                <span className="d-inline-flex align-items-center">
                  {dateType}
                  <i className="bi bi-arrow-down-up ms-2"></i>
                </span>
              </th>
              <th className="col-2">카테고리</th>
              <th className="col-2">보관방법</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.quantity}</td>
                  <td>
                    {row[dateType === "유통기한" ? "shelfLife" : "consumeBy"]}
                  </td>
                  <td>{row.category}</td>
                  <td>{row.storage}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  등록된 식재료가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientsTable;
