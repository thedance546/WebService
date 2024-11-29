// src/components/organisms/LoadingModal.js
import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const LoadingModal = () => (
  <Modal show centered backdrop="static" keyboard={false}>
    <Modal.Body className="text-center p-4">
      <Spinner animation="border" role="status" className="mb-3">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <h3>처리 중...</h3>
    </Modal.Body>
  </Modal>
);

export default LoadingModal;
