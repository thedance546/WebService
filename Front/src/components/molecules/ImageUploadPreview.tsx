// src/components/molecules/ImageUploadPreview.tsx

import React, { useState } from 'react';
import FileUploader from '../atoms/FileUploader';
import ImagePreview from '../atoms/ImagePreview';

interface ImageUploadPreviewProps {
  onFileSelect: (file: File) => void;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({ onFileSelect }) => {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewSrc(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  return (
    <div className="my-3">
      <FileUploader onFileChange={handleFileChange} accept="image/*" />
      {previewSrc && <ImagePreview src={previewSrc} />}
    </div>
  );
};

export default ImageUploadPreview;
