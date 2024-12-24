// src/features/ChatBot/CustomInfoInputModal.tsx

import React, { useState } from 'react';
import Modal from '../../components/molecules/Modal';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';

interface CustomInfoInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (info: string) => void;
}

const CustomInfoInputModal: React.FC<CustomInfoInputModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [info, setInfo] = useState('');

  const handleSubmit = () => {
    if (info.trim()) {
      onSubmit(info);
      setInfo('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="정보 입력" onClose={onClose}>
      <div className="p-3">
        <Input
          type="text"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          placeholder="입력할 정보를 입력하세요"
          className="mb-3"
        />
        <div className="d-flex justify-content-end">
          <Button onClick={onClose} variant="secondary" className="me-2">
            취소
          </Button>
          <Button onClick={handleSubmit} variant="primary">
            제출
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomInfoInputModal;
