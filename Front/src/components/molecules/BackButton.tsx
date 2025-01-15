// src/components/molecules/BackButton.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';

interface BackButtonProps {
  to?: string;
  className?: string;
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({
  to = '/',
  className = 'btn w-50 me-2',
  children = '<',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <Button
      onClick={handleBack}
      className={className}
      style={{
        backgroundColor: '#DFF4E0',
        color: 'black',
        border: 'none',
      }}
    >
      {children}
    </Button>
  );
};

export default BackButton;
