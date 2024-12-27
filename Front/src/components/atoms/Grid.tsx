// src/components/atoms/Grid.tsx

import React, { ReactNode } from 'react';

interface GridProps {
  children: ReactNode;
  columns: number;
  columnsMd?: number;
  className?: string;
}

const Grid: React.FC<GridProps> = ({ children, columns, columnsMd = null, className = '' }) => {
  const gridStyle: React.CSSProperties = {
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

export default Grid;
