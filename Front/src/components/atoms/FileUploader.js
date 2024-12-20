// src/components/atoms/FileUploader.js

import React from 'react';
import PropTypes from 'prop-types';

const FileUploader = ({ onFileChange, accept = 'image/*', className = '' }) => (
  <input
    type="file"
    accept={accept}
    onChange={onFileChange}
    className={`form-control ${className}`}
  />
);

FileUploader.propTypes = {
  onFileChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
  className: PropTypes.string,
};

export default FileUploader;
