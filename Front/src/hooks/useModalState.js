import { useState } from 'react';

export const useModalState = (initialState = { file: null, type: '' }) => {
  const [selectedFile, setSelectedFile] = useState(initialState.file);
  const [photoType, setPhotoType] = useState(initialState.type);

  const reset = () => {
    setSelectedFile(initialState.file);
    setPhotoType(initialState.type);
  };

  return {
    selectedFile,
    setSelectedFile,
    photoType,
    setPhotoType,
    reset,
  };
};
