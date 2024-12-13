// src/features/MyIngredients/TableRow.js
import React from "react";
import { calculateDate } from "../../utils/Utils";

const TableRow = ({ row, onClick, dateType }) => {
  return (
    <tr onClick={onClick}>
      <td>{row.name || ""}</td>
      <td>{row.quantity || 1}</td>
      <td>{row.category || ""}</td>
      <td>
        {calculateDate(
          row.purchaseDate,
          row[dateType === "유통기한" ? "shelfLife" : "consumeBy"]
        )}
      </td>
      <td>{row.storage || ""}</td>
    </tr>
  );
};

export default TableRow;
