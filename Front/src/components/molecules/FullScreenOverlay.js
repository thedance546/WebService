// src/components/atoms/FullScreenOverlay.js

import React from 'react';
import PropTypes from 'prop-types';
import BaseHeader from '../atoms/BaseHeader';

const FullScreenOverlay = ({ title, children, onClose, headerStyle }) => (
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column bg-dark bg-opacity-75" style={{ zIndex: 1050 }}>
    <BaseHeader title={title} onClose={onClose} headerStyle={headerStyle} />
    <div className="flex-grow-1 overflow-auto bg-white p-3">
      {children}
    </div>
  </div>
);

FullScreenOverlay.propTypes = {
  title: PropTypes.string.isRequired,
  headerStyle: PropTypes.object,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

FullScreenOverlay.defaultProps = {
  headerStyle: { backgroundColor: '#28a745', color: '#fff' },
};

export default FullScreenOverlay;
