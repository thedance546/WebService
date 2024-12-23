// src/features/MyIngredients/TableRow.tsx

import React from "react";
import { calculateDate } from "../../utils/Utils";

interface IngredientRow {
  name: string;
  quantity: number;
  category: string;
  storage: string;
  originalIndex?: number;
  purchaseDate?: string | Date;
  shelfLife?: number;
  consumeBy?: number;
}

interface TableRowProps {
  row: IngredientRow;
  onClick: () => void;
  dateType: "유통기한" | "소비기한";
  onDelete: () => void;
}

const TableRow: React.FC<TableRowProps> = ({ row, onClick, dateType, onDelete }) => {
  const { purchaseDate, shelfLife, consumeBy, storage, category, name, quantity } = row;

  return (
    <tr onClick={onClick}>
      <td>{name || ""}</td>
      <td>{quantity || 1}</td>
      <td>{category || ""}</td>
      <td>
        {purchaseDate &&
          calculateDate(
            new Date(purchaseDate),
            dateType === "유통기한" ? shelfLife || 0 : consumeBy || 0
          )}
      </td>
      <td>{storage || ""}</td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          삭제
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
