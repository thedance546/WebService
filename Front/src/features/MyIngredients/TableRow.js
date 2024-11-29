// TableRow.js 수정 코드
import React from "react";
import Input from "../../components/atoms/Input";

const TableRow = ({
  row = { name: "", quantity: 1, category: "", purchaseDate: "", shelfLife: 0, storage: "" },
  index,
  onDeleteRow,
  onSaveRow,
  editableRowIndex,
  setEditableRowIndex,
  setEditedRow,
  calculateDate,
  dateType,
}) => {
  const handleRowEdit = (field, value) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const saveRow = () => {
    onSaveRow();
  };

  const deleteRow = () => {
    onDeleteRow();
    setEditableRowIndex(null);
  };

  return (
    <tr
      onClick={() => editableRowIndex !== row.originalIndex && setEditableRowIndex(index)}
      style={{ position: "relative" }}
    >
      <td>
        {editableRowIndex === row.originalIndex ? (
          <Input
            type="text"
            value={row.name || ""}
            onChange={(e) => handleRowEdit("name", e.target.value)}
            className="form-control"
          />
        ) : (
          row.name || ""
        )}
      </td>
      <td>
        {editableRowIndex === row.originalIndex ? (
          <Input
            type="number"
            value={row.quantity || 1}
            onChange={(e) => handleRowEdit("quantity", e.target.value)}
            className="form-control"
          />
        ) : (
          row.quantity || 1
        )}
      </td>
      <td>
        {editableRowIndex === row.originalIndex ? (
          <Input
            type="text"
            value={row.category || ""}
            onChange={(e) => handleRowEdit("category", e.target.value)}
            className="form-control"
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

      {editableRowIndex === row.originalIndex && (
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
              saveRow();
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
