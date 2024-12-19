// src/components/molecules/FullScreenOverlay.js

import React from 'react';
import Modal from '../atoms/Modal';
import PropTypes from 'prop-types';

const FullScreenOverlay = ({ title, children, onClose, headerStyle }) => {
  return (
    <Modal title={title} headerStyle={headerStyle} onClose={onClose}>
      {/* 본문 */}
      <div className="flex-grow-1 overflow-auto">{children}</div>
    </Modal>
  );
};

FullScreenOverlay.propTypes = {
  title: PropTypes.string.isRequired,
  headerStyle: PropTypes.object, // 추가된 Prop
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

FullScreenOverlay.defaultProps = {
  headerStyle: { backgroundColor: '#28a745', color: '#fff' }, // 기본 스타일
};

export default FullScreenOverlay;
