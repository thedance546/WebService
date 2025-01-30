// src/features/ChatBot/OptionsModal.tsx

import React from 'react';
import Modal from '../../components/molecules/Modal';
import Button from '../../components/atoms/Button';
import Grid from '../../components/atoms/Grid';

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clearMessages: () => void;
  openRecipeModal: () => void;
  openCustomInfoModal: () => void;
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  onClose,
  clearMessages,
  openRecipeModal,
  openCustomInfoModal,
}) => {
  if (!isOpen) return null;

  const topOptions = [
    {
      label: '레시피 추천 받기',
      icon: '🍴',
      action: () => {
        openRecipeModal();
        onClose();
      },
    },
    {
      label: '사용자 정보 입력',
      icon: '✍️',
      action: () => {
        openCustomInfoModal();
        onClose();
      },
    },
  ];

  return (
    <Modal title="옵션 메뉴" onClose={onClose}>
      {/* 위 2개의 버튼 */}
      <Grid columns={2} columnsMd={2} margin="0 1rem" className="gap-4 mb-3">
        {topOptions.map((option, index) => (
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

      {/* 아래 긴 버튼 */}
      <div className="d-flex justify-content-center mt-3">
        <Button
          onClick={clearMessages}
          className="d-flex align-items-center justify-content-center px-4 py-3"
          variant="light"
          style={{
            width: '80%', // 긴 버튼
            borderRadius: '8px',
          }}
        >
          <span style={{ marginRight: '10px' }}>🗑️</span>
          <span>채팅 내역 지우기</span>
        </Button>
      </div>
    </Modal>
  );
};

export default OptionsModal;
