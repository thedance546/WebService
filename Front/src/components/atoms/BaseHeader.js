// src/components/atoms/BaseHeader.js

import React from 'react';
import PropTypes from 'prop-types';

const BaseHeader = ({ title, onClose, headerStyle }) => (
  <div
    className="text-center fw-bold py-3 position-relative"
    style={{ backgroundColor: headerStyle?.backgroundColor || '#007bff', color: headerStyle?.color || '#fff' }}
  >
    {title}
    <button
      onClick={onClose}
      className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
      aria-label="Close"
    />
  </div>
);

BaseHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  headerStyle: PropTypes.object,
};

BaseHeader.defaultProps = {
  headerStyle: { backgroundColor: '#28a745', color: '#fff' },
};

export default BaseHeader;
