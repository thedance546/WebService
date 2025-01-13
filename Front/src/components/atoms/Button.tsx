// src/components/atoms/Button.tsx

import React, { CSSProperties } from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  style?: CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  onClick,
  children,
  className = '',
  disabled = false,
  variant,
  style,
}) => {
  const defaultStyle: CSSProperties = {
    backgroundColor: !variant && !style?.backgroundColor ? 'var(--primary-color)' : undefined,
    color: !variant && !style?.color ? '#000' : undefined,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${variant ? `btn-${variant}` : ''} ${className}`}
      disabled={disabled}
      style={{
        ...defaultStyle, // 기본 색상
        ...style,        // 사용자 지정 스타일
      }}
    >
      {children}
    </button>
  );
};

export default Button;
