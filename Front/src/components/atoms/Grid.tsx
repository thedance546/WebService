// src/components/atoms/Grid.tsx

import React, { ReactNode } from 'react';
import './Grid.css';

interface GridProps {
  children: ReactNode;
  columns: number;
  columnsMd?: number;
  className?: string;
  margin?: string;
}

const Grid: React.FC<GridProps> = ({ children, columns, columnsMd, className = '', margin }) => {
  const baseClass = `grid-columns-${columns}`;
  const responsiveClass = columnsMd ? `grid-columns-md-${columnsMd}` : '';
  const style = { margin };

  return (
    <div className={`responsive-grid ${baseClass} ${responsiveClass} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Grid;
