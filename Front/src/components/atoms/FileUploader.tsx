// src/components/atoms/FileUploader.tsx

import React from 'react';

interface FileUploaderProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange, accept = 'image/*', className = '' }) => (
  <input
    type="file"
    accept={accept}
    onChange={onFileChange}
    className={`form-control ${className}`}
  />
);

export default FileUploader;
