// src/components/Ingredients/FileUploader.js
import React from 'react';

const FileUploader = ({ selectedFile, onFileChange }) => (
  <div className="my-3">
    <input
      type="file"
      accept="image/*"
      onChange={onFileChange}
      className="form-control"
    />
    {selectedFile && (
      <div className="border rounded p-3 mt-3 text-center">
        <img src={selectedFile} alt="미리보기" className="img-fluid rounded" />
      </div>
    )}
  </div>
);

export default FileUploader;
