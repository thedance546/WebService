// src/components/Ingredients/FileUploader.js

import React from 'react';
import './FileUploader.css';

const FileUploader = ({ selectedFile, onFileChange }) => (
  <div>
    <input
      type="file"
      accept="image/*"
      onChange={onFileChange}
      className="file-input"
    />
    {selectedFile && (
      <div className="preview-container">
        <img src={selectedFile} alt="미리보기" className="preview-image" />
      </div>
    )}
  </div>
);

export default FileUploader;
