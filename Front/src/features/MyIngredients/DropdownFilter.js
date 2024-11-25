// src/features/MyIngredients/DropdownFilter.js
import React from "react";

const DropdownFilter = ({ filter, setFilter }) => {
    return (
        <div className="d-flex justify-content-between mb-3 px-2">
            <select
                className="form-select w-auto"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >
                <option value="전체">전체</option>
                <option value="냉장">냉장</option>
                <option value="냉동">냉동</option>
                <option value="상온">상온</option>
            </select>
        </div>
    );
};

export default DropdownFilter;
