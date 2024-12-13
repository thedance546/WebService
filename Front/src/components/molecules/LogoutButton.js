// src/components/molecules/LogoutButton.js
import React from 'react';
import useAuth from '../../hooks/useAuth';
import Button from '../atoms/Button';

const LogoutButton = () => {
  const { handleLogout } = useAuth();

  const onClick = async () => {
    const message = await handleLogout();
    alert(message);
  };

  return (
    <Button onClick={onClick} className="btn btn-warning w-100">
      로그아웃
    </Button>
  );
};

export default LogoutButton;
