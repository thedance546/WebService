// src/components/molecules/ImageUploadPreview.js

import React, { useState } from 'react';
import FileUploader from '../atoms/FileUploader';
import ImagePreview from '../atoms/ImagePreview';

const ImageUploadPreview = ({ onFileSelect }) => {
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
      <FileUploader onFileChange={handleFileChange} accept="image/*" />
      <ImagePreview src={previewSrc} />
    </div>
  );
};

export default ImageUploadPreview;

