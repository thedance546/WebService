// src/components/molecules/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';

const BackButton = ({ to = '/', className = 'btn btn-secondary w-50 me-2', children = '뒤로가기' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <Button onClick={handleBack} className={className}>
      {children}
    </Button>
  );
};

export default BackButton;
