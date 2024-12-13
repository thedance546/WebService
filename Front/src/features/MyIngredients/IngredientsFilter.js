// src/features/MyIngredients/IngredientsFilter.js
import React from "react";
import Filter from "../../components/atoms/DropdownFilter";

const IngredientsFilter = ({ filter, setFilter }) => {
  const options = [
    { value: "전체", label: "전체" },
    { value: "냉장", label: "냉장" },
    { value: "냉동", label: "냉동" },
    { value: "상온", label: "상온" },
  ];

  return (
    <div className="d-flex justify-content-between mb-3 px-2">
      <Filter
        options={options}
        value={filter}
        onChange={setFilter}
        className="w-auto"
      />
    </div>
  );
};

export default IngredientsFilter;
