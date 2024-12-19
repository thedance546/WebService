// src/components/atoms/Grid.js

import React from 'react';
import PropTypes from 'prop-types';

const Grid = ({ children, columns, columnsMd, className }) => {
  const gridClass = `row row-cols-${columns} ${columnsMd ? `row-cols-md-${columnsMd}` : ''} ${className}`;

  return <div className={gridClass.trim()}>{children}</div>;
};

Grid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.number,
  columnsMd: PropTypes.number,
  className: PropTypes.string,
};

Grid.defaultProps = {
  columns: 2,
  columnsMd: 3,
  className: '',
};

export default Grid;
