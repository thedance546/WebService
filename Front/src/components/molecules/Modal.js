// src/components/atoms/Modal.js

import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import BaseHeader from '../atoms/BaseHeader';

const Modal = ({ title, headerStyle, children, onClose }) => (
  <BootstrapModal show={true} onHide={onClose} centered>
    <BaseHeader title={title} onClose={onClose} headerStyle={headerStyle} />
    <BootstrapModal.Body>{children}</BootstrapModal.Body>
  </BootstrapModal>
);

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  headerStyle: PropTypes.object,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
