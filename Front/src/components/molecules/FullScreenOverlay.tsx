// src/components/atoms/FullScreenOverlay.tsx

import React from 'react';
import BaseHeader from '../atoms/BaseHeader';

interface FullScreenOverlayProps {
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
  headerStyle?: React.CSSProperties;
}

const FullScreenOverlay: React.FC<FullScreenOverlayProps> = ({
  title,
  children,
  onClose,
  headerStyle,
}) => (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column bg-dark bg-opacity-75"
    style={{ zIndex: 1050 }}
  >
    <BaseHeader title={title} onClose={onClose} headerStyle={headerStyle} />
    <div className="container flex-grow-1 overflow-auto bg-white p-3">{children}</div>
  </div>
);

export default FullScreenOverlay;
