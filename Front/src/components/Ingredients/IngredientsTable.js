// src/components/Ingredients/IngredientsTable.js
import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons

const IngredientsTable = ({ data }) => {
  const [filter, setFilter] = useState("전체");
  const [dateType, setDateType] = useState("유통기한");

  const filteredData = data.filter((item) =>
    filter === "전체" ? true : item.storage === filter
  );

  const toggleDateType = () => {
    setDateType((prev) => (prev === "유통기한" ? "소비기한" : "유통기한"));
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
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
      <table className="table">
        <thead>
          <tr>
            <th>이름</th>
            <th
              className="text-center"
              style={{ cursor: "pointer" }}
              onClick={toggleDateType}
            >
              <span className="d-inline-flex align-items-center">
                {dateType}
                <i className="bi bi-arrow-down-up ms-2"></i>
              </span>
            </th>
            <th>카테고리</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row[dateType === "유통기한" ? "shelfLife" : "consumeBy"]}</td>
                <td>{row.category}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                등록된 식재료가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientsTable;
