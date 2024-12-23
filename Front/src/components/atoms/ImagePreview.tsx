// src/components/atoms/ImagePreview.tsx

import React from 'react';

interface ImagePreviewProps {
  src?: string; // 이미지 경로 (옵션)
  alt?: string; // 대체 텍스트
  className?: string; // 추가 클래스
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt = '미리보기', className = '' }) =>
  src ? (
    <div className="border rounded p-3 mt-3 text-center">
      <img src={src} alt={alt} className={`img-fluid rounded ${className}`} />
    </div>
  ) : null;

export default ImagePreview;
