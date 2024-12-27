// src/components/atoms/Grid.tsx

import React, { ReactNode } from 'react';
import './Grid.css';

interface GridProps {
  children: ReactNode;
  columns: number;
  columnsMd?: number;
  className?: string;
}

const Grid: React.FC<GridProps> = ({ children, columns, columnsMd, className = '' }) => {
  const baseClass = `grid-columns-${columns}`;
  const responsiveClass = columnsMd ? `grid-columns-md-${columnsMd}` : '';

  return (
    <div className={`responsive-grid ${baseClass} ${responsiveClass} ${className}`}>
      {children}
    </div>
  );
};

export default Grid;
