// src/features/MyIngredients/TableRow.tsx

import React from "react";
import { calculateDate } from "../../utils/Utils";

interface TableRowProps {
  row: any;
  onClick: () => void;
  dateType: string;
}

const TableRow: React.FC<TableRowProps> = ({ row, onClick, dateType }) => {
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
