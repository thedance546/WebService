// src/components/molecules/LogoutButton.tsx

import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import Button from '../atoms/Button';

interface LogoutButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className, style }) => {
  const { logout } = useAuthContext();

  const onClick = async () => {
    try {
      await logout();
      alert('로그아웃되었습니다.');
    } catch (err: any) {
      alert('로그아웃에 실패했습니다: ' + err.message);
    }
  };

  return (
    <Button
      onClick={onClick}
      className={`btn btn-warning text-nowrap ${className}`}
      style={style}
    >
      로그아웃
    </Button>
  );
};

export default LogoutButton;
