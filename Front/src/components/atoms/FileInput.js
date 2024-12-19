// src/components/atoms/FileInput.js

import React from 'react';
import PropTypes from 'prop-types';

const FileInput = ({ onFileChange, accept = 'image/*', className = '' }) => (
  <input
    type="file"
    accept={accept}
    onChange={onFileChange}
    className={`form-control ${className}`}
  />
);

FileInput.propTypes = {
  onFileChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
  className: PropTypes.string,
};

export default FileInput;
