// src/components/molecules/ImageUploadPreview.tsx

import React, { useState } from 'react';
import FileUploader from '../atoms/FileUploader';
import ImagePreview from '../atoms/ImagePreview';

interface ImageUploadPreviewProps {
  onFileSelect: (file: File) => void;
  previewStyle?: React.CSSProperties;
  placeholderMessage?: string;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  onFileSelect,
  previewStyle,
  placeholderMessage = '이미지를 업로드하면 여기에 미리보기가 표시됩니다.',
}) => {
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
      <ImagePreview
        src={previewSrc || undefined}
        alt={placeholderMessage}
        style={previewStyle}
      >
        {!previewSrc && (
          <div>{placeholderMessage}</div>
        )}
      </ImagePreview>
    </div>
  );
};

export default ImageUploadPreview;
