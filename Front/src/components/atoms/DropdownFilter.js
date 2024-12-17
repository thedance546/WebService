// src/components/atoms/DropdownFilter.js
import React from "react";
import PropTypes from "prop-types";

const Filter = ({ options, value, onChange, className }) => {
  return (
    <select
      className={`form-select ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

Filter.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Filter.defaultProps = {
  className: "",
};

export default Filter;