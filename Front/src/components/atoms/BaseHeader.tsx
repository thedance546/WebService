// src/components/atoms/BaseHeader.tsx

import React from 'react';

interface BaseHeaderProps {
  title: string;
  onClose: () => void;
  headerStyle?: {
    backgroundColor?: string;
    color?: string;
  };
}

const BaseHeader: React.FC<BaseHeaderProps> = ({ title, onClose, headerStyle }) => (
  <div
    className="text-center fw-bold py-3 position-relative"
    style={{
      color: headerStyle?.color || 'var(--text-color)', // 기본 텍스트 색상
      backgroundColor: headerStyle?.backgroundColor || 'var(--primary-color)', // 기본 배경색
    }}
  >
    {title}
    <button
      onClick={onClose}
      className="btn-close btn-close-black position-absolute top-0 end-0 m-3"
      aria-label="Close"
    />
  </div>
);

export default BaseHeader;
