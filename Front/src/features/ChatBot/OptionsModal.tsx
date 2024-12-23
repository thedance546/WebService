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
  handleImageUpload: (file: File) => void; // 추가된 Props
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  onClose,
  clearMessages,
  openRecipeModal,
  handleImageUpload, // Props 추가
}) => {
  if (!isOpen) return null;

  const options = [
    {
      label: '레시피 추천 받기',
      icon: '🍴',
      action: () => {
        openRecipeModal();
        onClose();
      },
    },
    { label: '채팅 내역 지우기', icon: '🗑️', action: clearMessages },
    {
      label: '이미지 업로드',
      icon: '📷',
      action: () => {
        const file = new File(["dummy content"], "example.jpg", { type: "image/jpeg" });
        handleImageUpload(file); // 이미지 업로드 동작 추가
        onClose();
      },
    },
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
