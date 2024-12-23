// src/components/atoms/Button.tsx

import React, { CSSProperties } from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  style?: CSSProperties; // 추가된 스타일 프로퍼티
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  onClick,
  children,
  className = '',
  disabled = false,
  variant = 'primary',
  style, // 스타일 프로퍼티 추가
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
      style={style} // 스타일 적용
    >
      {children}
    </button>
  );
};

export default Button;
