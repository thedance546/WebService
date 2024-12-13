// src/components/molecules/DeleteAccountButton.js
import React from 'react';
import useAuth from '../../hooks/useAuth';
import Button from '../atoms/Button';

const DeleteAccountButton = () => {
  const { handleDeleteAccount } = useAuth();

  const onClick = async () => {
    const message = await handleDeleteAccount();
    alert(message);
  };

  return (
    <Button onClick={onClick} className="btn btn-danger w-100">
      회원탈퇴
    </Button>
  );
};

export default DeleteAccountButton;
