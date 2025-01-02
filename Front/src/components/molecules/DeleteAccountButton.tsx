// src/components/molecules/DeleteAccountButton.tsx

import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import Button from '../atoms/Button';

const DeleteAccountButton: React.FC = () => {
  const { deleteAccount } = useAuthContext();

  const onClick = async () => {
    try {
      await deleteAccount();
      alert('회원탈퇴가 완료되었습니다.');
    } catch (error: any) {
      alert('회원탈퇴에 실패했습니다: ' + error.message);
    }
  };

  return (
    <Button onClick={onClick} className="btn btn-danger w-100">
      회원탈퇴
    </Button>
  );
};

export default DeleteAccountButton;
