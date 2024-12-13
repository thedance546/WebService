// src/features/MyIngredients/IngredientsTable.js
import React, { useState } from "react";
import Switch from "react-switch";
import TableRow from "./TableRow";
import IngredientsFilter from "./IngredientsFilter";
import EditIngredientModal from "./EditIngredientModal";
import "./IngredientsTable.css";

const IngredientsTable = ({ data, onDeleteRow, onSaveRow }) => {
  const [filter, setFilter] = useState("전체");
  const [dateType, setDateType] = useState("유통기한");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const filteredData = filter === "전체"
    ? data.map((item, index) => ({ ...item, originalIndex: index }))
    : data
        .map((item, index) => ({ ...item, originalIndex: index }))
        .filter((item) => item.storage === filter);

  const toggleDateType = () => {
    setDateType((prev) => (prev === "유통기한" ? "소비기한" : "유통기한"));
  };

  const toggleEditMode = (checked) => {
    setIsEditMode(checked);
  };

  const handleRowClick = (index) => {
    if (isEditMode) {
      const originalIndex = filteredData[index].originalIndex;
      setSelectedRow({ ...filteredData[index], originalIndex });
    }
  };

  const handleModalSave = (updatedRow) => {
    onSaveRow(updatedRow.originalIndex, updatedRow);
    setSelectedRow(null);
  };

  const handleModalCancel = () => {
    setSelectedRow(null);
  };

  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between mb-3 px-2 align-items-center">
        <IngredientsFilter filter={filter} setFilter={setFilter} />
        <div className="d-flex align-items-center">
          <label className="me-2">조회 모드</label>
          <Switch
            checked={isEditMode}
            onChange={toggleEditMode}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={22}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={26}
            width={48}
          />
          <label className="ms-2">수정 모드</label>
        </div>
      </div>

      <div className="table-responsive-scrollable position-relative">
        <table className="table table-striped table-bordered text-center table-nowrap">
          <thead className="table-light">
            <tr>
              <th className="col-3">이름</th>
              <th className="col-2">수량</th>
              <th className="col-2">카테고리</th>
              <th className="col-3" style={{ cursor: "pointer" }} onClick={toggleDateType}>
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
                onClick={() => handleRowClick(index)}
                dateType={dateType}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedRow && (
        <EditIngredientModal
          row={selectedRow}
          onSave={handleModalSave}
          onCancel={handleModalCancel}
        />
      )}
    </div>
  );
};

export default IngredientsTable;
