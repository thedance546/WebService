// src/components/atoms/ImagePreview.js

import React from 'react';
import PropTypes from 'prop-types';

const ImagePreview = ({ src, alt = '미리보기', className = '' }) => (
  src ? (
    <div className="border rounded p-3 mt-3 text-center">
      <img src={src} alt={alt} className={`img-fluid rounded ${className}`} />
    </div>
  ) : null
);

ImagePreview.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default ImagePreview;
