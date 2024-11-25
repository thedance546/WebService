import React from "react";

const TableRow = ({
  row = { name: "", quantity: 1, category: "", purchaseDate: "", shelfLife: 0, storage: "" },
  index,
  onDeleteRow,
  onSaveRow, // SaveRow 핸들러 추가
  editableRowIndex,
  setEditableRowIndex,
  calculateDate,
  dateType,
}) => {
  const handleRowEdit = (field, value) => {
    const updatedRow = { ...row, [field]: value };
    onSaveRow(index, updatedRow); // SaveRow 호출
  };

  const saveRow = () => {
    const updatedRow = {
      ...row,
      quantity: row.quantity > 0 ? row.quantity : 1, // 기본값 1
    };
    setEditableRowIndex(null); // 편집 모드 종료
    onSaveRow(index, updatedRow); // 상위 컴포넌트로 데이터 전달
  };

  const deleteRow = () => {
    onDeleteRow(index);
    setEditableRowIndex(null); // 편집 모드 종료
  };

  return (
    <tr
      onClick={() => editableRowIndex !== index && setEditableRowIndex(index)}
      style={{ position: "relative" }}
    >
      <td>
        {editableRowIndex === index ? (
          <input
            type="text"
            className="form-control"
            value={row.name || ""}
            onChange={(e) => handleRowEdit("name", e.target.value)}
          />
        ) : (
          row.name || ""
        )}
      </td>
      <td>
        {editableRowIndex === index ? (
          <input
            type="number"
            className="form-control"
            value={row.quantity || 1}
            onChange={(e) => handleRowEdit("quantity", e.target.value)}
          />
        ) : (
          row.quantity || 1
        )}
      </td>
      <td>
        {editableRowIndex === index ? (
          <input
            type="text"
            className="form-control"
            value={row.category || ""}
            onChange={(e) => handleRowEdit("category", e.target.value)}
          />
        ) : (
          row.category || ""
        )}
      </td>
      <td>
        {calculateDate(
          row.purchaseDate,
          row[dateType === "유통기한" ? "shelfLife" : "consumeBy"]
        )}
      </td>
      <td>{row.storage}</td>

      {editableRowIndex === index && (
        <div
          className="floating-save-delete-buttons"
          style={{
            position: "absolute",
            top: "50%",
            left: "60%",
            transform: "translateY(-50%)",
            zIndex: 10,
          }}
        >
          <button
            className="btn btn-success me-2"
            onClick={(e) => {
              e.stopPropagation();
              saveRow(); // SaveRow 호출
            }}
          >
            확인
          </button>
          <button
            className="btn btn-danger"
            onClick={(e) => {
              e.stopPropagation();
              deleteRow();
            }}
          >
            삭제
          </button>
        </div>
      )}
    </tr>
  );
};

export default TableRow;
