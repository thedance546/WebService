// src/components/atoms/FullScreenOverlay.js

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const FullScreenOverlay = ({ title, children, onClose }) => {
  return (
    <div className="d-flex flex-column position-fixed top-0 start-0 w-100 h-100 bg-light">
      {/* 헤더 */}
      <div className="d-flex justify-content-between align-items-center bg-primary text-white px-3 py-2">
        <h5 className="mb-0">{title}</h5>
        <Button variant="light" className="btn-close" onClick={onClose} aria-label="Close" />
      </div>

      {/* 내용 */}
      <div className="flex-grow-1 overflow-auto p-3">
        {children}
      </div>
    </div>
  );
};

FullScreenOverlay.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default FullScreenOverlay;
