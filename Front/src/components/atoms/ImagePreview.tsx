// src/components/atoms/ImagePreview.tsx

import React from 'react';

interface ImagePreviewProps {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt = '미리보기', className = '', style, children }) => (
  <div className="border rounded p-3 mt-3 text-center">
    {src ? (
      <img
        src={src}
        alt={alt}
        className={`img-fluid rounded ${className}`}
        style={{
          maxWidth: '100%',
          objectFit: 'contain',
          ...style,
        }}
      />
    ) : (
      children || <span>{alt}</span>
    )}
  </div>
);

export default ImagePreview;

