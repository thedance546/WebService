// src/components/atoms/Modal.js

import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Modal = ({ title, headerStyle, children, onClose }) => {
  return (
    <BootstrapModal show={true} onHide={onClose} centered>
      <BootstrapModal.Header style={headerStyle} closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>{children}</BootstrapModal.Body>
    </BootstrapModal>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  headerStyle: PropTypes.object, // 추가된 Prop
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  headerStyle: {}, // 기본 스타일은 빈 객체
};

export default Modal;
