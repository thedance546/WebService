import React, { useState, useEffect } from "react";
import TableRow from "./TableRow";
import IngredientsFilter from "./IngredientsFilter";
import { calculateDate } from "../../utils/Utils";
import "./IngredientsTable.css";

const IngredientsTable = ({ data, onDeleteRow, onSaveRow }) => {
  const [filter, setFilter] = useState("전체");
  const [dateType, setDateType] = useState("유통기한");
  const [editableRowIndex, setEditableRowIndex] = useState(null);
  const [editedRow, setEditedRow] = useState(null);

  // 원본 데이터의 인덱스를 포함하여 필터링된 데이터 생성
  const filteredData = filter === "전체"
    ? data.map((item, index) => ({ ...item, originalIndex: index }))
    : data
        .map((item, index) => ({ ...item, originalIndex: index }))
        .filter((item) => item.storage === filter);

  useEffect(() => {
    // 필터가 변경될 때만 수정 상태 초기화
    if (editableRowIndex !== null) {
      setEditableRowIndex(null);
      setEditedRow(null);
    }
  }, [filter]); // 필터가 변경될 때만 실행

  const toggleDateType = () => {
    setDateType((prev) => (prev === "유통기한" ? "소비기한" : "유통기한"));
  };

  const handleRowEdit = (index) => {
    const originalIndex = filteredData[index].originalIndex; // 원본 데이터의 인덱스 참조
    setEditableRowIndex(originalIndex);
    setEditedRow({ ...filteredData[index] }); // 필터링된 데이터 기준으로 수정 상태 저장
  };

const saveRow = () => {
  if (editedRow && editableRowIndex !== null) {
    const updatedRow = {
      ...editedRow,
      quantity: editedRow.quantity > 0 ? editedRow.quantity : 1, // 수량이 0 이하인 경우 1로 설정
    };
    onSaveRow(editableRowIndex, updatedRow);
    setEditableRowIndex(null);
    setEditedRow(null);
  }
};

  const deleteRow = (index) => {
    if (filteredData[index]) {
      onDeleteRow(filteredData[index].originalIndex);
    }
  };
  
  return (
    <div className="container-fluid px-0">
      <IngredientsFilter filter={filter} setFilter={setFilter} />

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
                row={editableRowIndex === row.originalIndex ? editedRow : row}
                index={index}
                onDeleteRow={deleteRow}
                onSaveRow={saveRow}
                editableRowIndex={editableRowIndex}
                setEditableRowIndex={handleRowEdit}
                setEditedRow={setEditedRow}
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
