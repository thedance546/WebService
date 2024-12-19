// src/components/atoms/Button.js
import React from 'react';

const Button = ({ type = 'button', onClick, children, className, disabled = false, variant = 'primary' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
