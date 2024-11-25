import React, { useState } from "react";
import TableRow from "./TableRow";
import DropdownFilter from "./DropdownFilter";
import { calculateDate } from "../../utils/Utils";
import "./IngredientsTable.css";

const IngredientsTable = ({ data, onDeleteRow, onSaveRow }) => {
  const [filter, setFilter] = useState("전체");
  const [dateType, setDateType] = useState("유통기한");
  const [editableRowIndex, setEditableRowIndex] = useState(null);

  const filteredData = filter === "전체" ? data : data.filter((item) => item.storage === filter);

  const toggleDateType = () => {
    setDateType((prev) => (prev === "유통기한" ? "소비기한" : "유통기한"));
  };

  return (
    <div className="container-fluid px-0">
      <DropdownFilter filter={filter} setFilter={setFilter} />

      <div className="table-responsive-scrollable position-relative">
        <table className="table table-striped table-bordered text-center table-nowrap">
          <thead className="table-light">
            <tr>
              <th className="col-3">이름</th>
              <th className="col-2">수량</th>
              <th className="col-2">카테고리</th>
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
              <th className="col-2">보관방법</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <TableRow
                key={index}
                row={row}
                index={index}
                onDeleteRow={onDeleteRow}
                onSaveRow={onSaveRow} // SaveRow 핸들러 전달
                editableRowIndex={editableRowIndex}
                setEditableRowIndex={setEditableRowIndex}
                calculateDate={calculateDate}
                dateType={dateType}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientsTable;
