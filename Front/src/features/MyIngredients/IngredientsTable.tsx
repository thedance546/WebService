// src/features/MyIngredients/IngredientsTable.tsx

import React, { useState } from "react";
import Switch from "react-switch";
import TableRow from "./TableRow";
import IngredientsFilter from "./IngredientsFilter";
//import EditIngredientModal from "./EditIngredientModal";
import "./IngredientsTable.css";
import { Ingredient } from "../../types/EntityTypes";

interface IngredientsTableProps {
  data: Ingredient[];
  onDeleteRow: (index: number) => void;
  onSaveRow: (index: number, row: Ingredient) => void;
}

interface IngredientRow {
  name: string;
  quantity: number;
  category: string;
  storage: string;
  originalIndex?: number;
}

const IngredientsTable: React.FC<IngredientsTableProps> = ({ data, onDeleteRow, onSaveRow }) => {
  const [filter, setFilter] = useState<string>("전체");
  const [dateType, setDateType] = useState<"유통기한" | "소비기한">("유통기한");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  //const [selectedRow, setSelectedRow] = useState<IngredientRow | null>(null);

  const filteredData: IngredientRow[] = data.map((item, index) => ({
    name: item.name,
    quantity: item.quantity,
    category: `카테고리 ${item.categoryId || "없음"}`,
    storage: `보관 ${item.storageMethodId || "없음"}`,
    originalIndex: index,
  }));

  const toggleDateType = () => {
    setDateType((prev) => (prev === "유통기한" ? "소비기한" : "유통기한"));
  };

  const toggleEditMode = (checked: boolean) => {
    setIsEditMode(checked);
  };

  const handleRowClick = (index: number) => {
  };

  // const handleRowClick = (index: number) => {
  //   if (isEditMode) {
  //     setSelectedRow(filteredData[index]);
  //   }
  // };

  // const handleModalSave = (updatedRow: IngredientRow) => {
  //   if (updatedRow.originalIndex !== undefined) {
  //     const updatedIngredient: Ingredient = {
  //       ...data[updatedRow.originalIndex],
  //       name: updatedRow.name,
  //       quantity: updatedRow.quantity,
  //       categoryId: parseInt(updatedRow.category.split(" ")[1]) || undefined,
  //       storageMethodId: parseInt(updatedRow.storage.split(" ")[1]) || undefined,
  //     };
  //     onSaveRow(updatedRow.originalIndex, updatedIngredient);
  //   }
  //   setSelectedRow(null);
  // };

  // const handleModalCancel = () => {
  //   setSelectedRow(null);
  // };

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
                onDelete={() => onDeleteRow(index)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* {selectedRow && (
        <EditIngredientModal
          row={selectedRow}
          onSave={handleModalSave}
          onCancel={handleModalCancel}
        />
      )} */}
    </div>
  );
};

export default IngredientsTable;
