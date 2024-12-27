// src/components/atoms/Modal.tsx

import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';
import BaseHeader from '../atoms/BaseHeader';

interface ModalProps {
  title: string;
  headerStyle?: React.CSSProperties;
  children?: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, headerStyle, children, onClose }) => (
  <BootstrapModal show={true} onHide={onClose} centered>
    <BaseHeader title={title} onClose={onClose} headerStyle={headerStyle} />
    <BootstrapModal.Body>{children}</BootstrapModal.Body>
  </BootstrapModal>
);

export default Modal;
