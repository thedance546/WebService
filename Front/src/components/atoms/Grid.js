// src/components/atoms/Grid.js

import React from 'react';
import PropTypes from 'prop-types';

const Grid = ({ children, columns, columnsMd = null, className = '' }) => {
  const gridStyle = {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  const mediaQueryStyle = columnsMd
    ? `@media (min-width: 768px) { 
         grid-template-columns: repeat(${columnsMd}, 1fr); 
       }`
    : '';

  return (
    <>
      <style>
        {`
          .responsive-grid {
            ${mediaQueryStyle}
          }
        `}
      </style>
      <div className={`responsive-grid ${className}`} style={gridStyle}>
        {children}
      </div>
    </>
  );
};

Grid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.number.isRequired, // 기본 열 개수
  columnsMd: PropTypes.number, // 중간 화면 이상 열 개수
  className: PropTypes.string, // 추가 클래스
};

export default Grid;
