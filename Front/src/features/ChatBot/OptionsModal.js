// src/features/ChatBot/OptionsModal.js

import React from 'react';
import Modal from '../../components/molecules/Modal';
import Button from '../../components/atoms/Button';
import Grid from '../../components/atoms/Grid';

const OptionsModal = ({ isOpen, onClose, clearMessages, openRecipeModal }) => {
  if (!isOpen) return null;

  const options = [
    {
      label: '레시피 추천 받기',
      icon: '🍴',
      action: () => {
        openRecipeModal();
        onClose(); // 옵션 모달 닫기
      },
    },
    { label: '채팅 내역 지우기', icon: '🗑️', action: clearMessages },
  ];

  return (
    <Modal title="옵션 메뉴" onClose={onClose}>
      <Grid columns={2} columnsMd={3} className="justify-content-center">
        {options.map((option, index) => (
          <div key={index} className="col d-flex justify-content-center">
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
  );
};

export default OptionsModal;

