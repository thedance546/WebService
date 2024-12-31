// src/components/molecules/LogoutButton.tsx

import React from 'react';
import useAuth from '../../hooks/useAuth';
import Button from '../atoms/Button';

interface LogoutButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className, style }) => {
  const { handleLogout } = useAuth();

  const onClick = async () => {
    const message = await handleLogout();
    alert(message);
  };

  return (
    <Button
      onClick={onClick}
      className={`btn btn-warning text-nowrap ${className}`}
    >
      로그아웃
    </Button>
  );
};

export default LogoutButton;
