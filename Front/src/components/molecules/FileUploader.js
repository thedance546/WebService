// src/components/molecules/FileUploader.js

import React, { useState } from 'react';
import FileInput from '../atoms/FileInput';
import ImagePreview from '../atoms/ImagePreview';

const FileUploader = ({ onFileSelect }) => {
  const [previewSrc, setPreviewSrc] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewSrc(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  return (
    <div className="my-3">
      <FileInput onFileChange={handleFileChange} accept="image/*" />
      <ImagePreview src={previewSrc} />
    </div>
  );
};

export default FileUploader;

