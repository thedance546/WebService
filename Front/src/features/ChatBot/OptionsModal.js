// src/features/ChatBot/OptionsModal.js
import React from 'react';
import Modal from '../../components/atoms/Modal';
import Button from '../../components/atoms/Button';
import Grid from '../../components/atoms/Grid';

const OptionsModal = ({ isOpen, onClose, addMessage, clearMessages, handleImageUpload }) => {
  if (!isOpen) return null;

  const options = [
    { label: '재료 사진 업로드', icon: '📷', action: () => document.getElementById('file-upload').click() },
    { label: '채팅 내역 지우기', icon: '🗑️', action: clearMessages },
  ];

  return (
    <>
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files.length > 0) handleImageUpload(e.target.files[0]);
        }}
      />
      <Modal title="옵션 메뉴" onClose={onClose}>
        <Grid columns={2} columnsMd={3}>
          {options.map((option, index) => (
            <div key={index} className="col">
              <Button
                onClick={option.action}
                className="d-flex flex-column align-items-center justify-content-center p-3"
                variant="light"
              >
                <div className="mb-2">{option.icon}</div>
                <div>{option.label}</div>
              </Button>
            </div>
          ))}
        </Grid>
      </Modal>
    </>
  );
};

export default OptionsModal;