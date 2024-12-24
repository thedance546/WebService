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
    style={{ backgroundColor: headerStyle?.backgroundColor || '#f9e000',
      color: headerStyle?.color || '#1e1e1e' }}
  >
    {title}
    <button
      onClick={onClose}
      className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
      aria-label="Close"
    />
  </div>
);

export default BaseHeader;
