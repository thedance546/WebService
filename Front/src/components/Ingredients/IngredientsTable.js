// src/components/Ingredients/IngredientsTable.js
import React, { useState } from "react";

const IngredientsTable = ({ data }) => {
  const [filter, setFilter] = useState("전체");
  const [dateType, setDateType] = useState("유통기한");

  const filteredData = data.filter((item) =>
    filter === "전체" ? true : item.storage === filter
  );

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
        <select
          className="form-select w-auto"
          value={dateType}
          onChange={(e) => setDateType(e.target.value)}
        >
          <option value="유통기한">유통기한</option>
          <option value="소비기한">소비기한</option>
        </select>
      </div>
      <table className="table mt-5">
        <thead>
          <tr>
            <th>이름</th>
            <th>{dateType}</th>
            <th>카테고리</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row[dateType === "유통기한" ? "shelfLife" : "consumeBy"]}</td>
              <td>{row.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientsTable;
