// src/components/atoms/Input.js
import React from "react";
import PropTypes from "prop-types";

const Input = ({ type, value, onChange, placeholder, className, disabled, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`form-control ${className} ${disabled ? 'is-disabled' : ''}`}
      disabled={props.disabled}
      {...props}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

Input.defaultProps = {
  type: "text",
  placeholder: "",
  className: "",
};

export default Input;